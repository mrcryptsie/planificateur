import json
import os
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .apps.exam_scheduler.models import Room, Proctor, Exam, TimeSlot

def json_serial(obj):
    """Convertir les objets spéciaux en JSON"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def convert_exam_to_frontend(exam):
    """Convertir un objet Exam Django vers le format attendu par le frontend"""
    proctors = list(exam.proctors.all())
    proctors_data = [
        {
            'id': p.id,
            'name': p.name,
            'department': p.department,
            'availability': p.availability,
            'avatarUrl': p.avatar_url
        }
        for p in proctors
    ]
    
    room_data = None
    if exam.room:
        room_data = {
            'id': exam.room.id,
            'name': exam.room.name,
            'capacity': exam.room.capacity,
            'occupancyRate': exam.room.occupancy_rate,
            'status': exam.room.status
        }
    
    return {
        'id': exam.id,
        'name': exam.name,
        'level': exam.level,
        'department': exam.department,
        'date': exam.date,
        'duration': exam.duration,
        'participants': exam.participants,
        'room': room_data,
        'proctors': proctors_data
    }

def convert_room_to_frontend(room):
    """Convertir un objet Room Django vers le format attendu par le frontend"""
    return {
        'id': room.id,
        'name': room.name,
        'capacity': room.capacity,
        'occupancyRate': room.occupancy_rate,
        'status': room.status
    }

def convert_proctor_to_frontend(proctor):
    """Convertir un objet Proctor Django vers le format attendu par le frontend"""
    return {
        'id': proctor.id,
        'name': proctor.name,
        'department': proctor.department,
        'availability': proctor.availability,
        'avatarUrl': proctor.avatar_url
    }

def convert_timeslot_to_frontend(timeslot):
    """Convertir un objet TimeSlot Django vers le format attendu par le frontend"""
    return {
        'id': timeslot.id,
        'startTime': timeslot.start_time,
        'endTime': timeslot.end_time,
        'roomId': timeslot.room.id if timeslot.room else None,
        'examId': timeslot.exam.id if timeslot.exam else None
    }

# API Routes

@require_http_methods(["GET"])
def get_rooms(request):
    rooms = Room.objects.all()
    room_data = [convert_room_to_frontend(room) for room in rooms]
    return JsonResponse(room_data, safe=False, json_dumps_params={'default': json_serial})

@require_http_methods(["GET"])
def get_proctors(request):
    proctors = Proctor.objects.all()
    proctor_data = [convert_proctor_to_frontend(proctor) for proctor in proctors]
    return JsonResponse(proctor_data, safe=False, json_dumps_params={'default': json_serial})

@require_http_methods(["GET"])
def get_exams(request):
    exams = Exam.objects.all()
    exam_data = [convert_exam_to_frontend(exam) for exam in exams]
    return JsonResponse(exam_data, safe=False, json_dumps_params={'default': json_serial})

@require_http_methods(["GET"])
def get_timeslots(request):
    timeslots = TimeSlot.objects.all()
    timeslot_data = [convert_timeslot_to_frontend(timeslot) for timeslot in timeslots]
    return JsonResponse(timeslot_data, safe=False, json_dumps_params={'default': json_serial})

@require_http_methods(["GET"])
def get_stats(request):
    # Calculer les statistiques
    total_exams = Exam.objects.count()
    total_rooms = Room.objects.count()
    total_proctors = Proctor.objects.count()
    
    # Taux d'occupation des salles
    room_occupation = 0
    if total_rooms > 0:
        rooms_with_exams = Room.objects.filter(exam__isnull=False).distinct().count()
        room_occupation = (rooms_with_exams / total_rooms) * 100
    
    # Répartition des surveillants
    proctor_distribution = 0
    if total_proctors > 0:
        assigned_proctors = Proctor.objects.filter(exam__isnull=False).distinct().count()
        proctor_distribution = (assigned_proctors / total_proctors) * 100
    
    # Équilibrage des créneaux
    time_slot_balance = 0
    if TimeSlot.objects.count() > 0:
        slots_with_exams = TimeSlot.objects.filter(exam__isnull=False).count()
        time_slot_balance = (slots_with_exams / TimeSlot.objects.count()) * 100
    
    # Répartition par département
    departments = {}
    for exam in Exam.objects.all():
        if exam.department in departments:
            departments[exam.department] += 1
        else:
            departments[exam.department] = 1
    
    exams_by_department = []
    for dept, count in departments.items():
        percentage = (count / total_exams) * 100 if total_exams > 0 else 0
        exams_by_department.append({
            'department': dept,
            'count': count,
            'percentage': round(percentage, 1)
        })
    
    stats = {
        'totalExams': total_exams,
        'totalRooms': total_rooms,
        'totalProctors': total_proctors,
        'roomOccupation': round(room_occupation, 1),
        'proctorDistribution': round(proctor_distribution, 1),
        'timeSlotBalance': round(time_slot_balance, 1),
        'examsByDepartment': exams_by_department
    }
    
    return JsonResponse(stats, json_dumps_params={'default': json_serial})