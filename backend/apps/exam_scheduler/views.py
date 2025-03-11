from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import datetime

from .models import Room, Proctor, Exam, TimeSlot
from .serializers import (
    RoomSerializer, ProctorSerializer, ExamSerializer, 
    TimeSlotSerializer, ExamDetailSerializer
)
from .optimizer import ExamScheduler

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class ProctorViewSet(viewsets.ModelViewSet):
    queryset = Proctor.objects.all()
    serializer_class = ProctorSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ExamDetailSerializer
        return self.serializer_class

    def get_queryset(self):
        queryset = Exam.objects.all()
        level = self.request.query_params.get('level')
        department = self.request.query_params.get('department')
        date = self.request.query_params.get('date')
        
        if level:
            queryset = queryset.filter(level=level)
        if department:
            queryset = queryset.filter(department=department)
        if date:
            try:
                search_date = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__date=search_date)
            except ValueError:
                pass
                
        return queryset

class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

@api_view(['GET'])
def get_stats(request):
    total_exams = Exam.objects.count()
    total_rooms = Room.objects.count()
    total_proctors = Proctor.objects.count()
    
    # Calculer le taux d'occupation des salles
    room_occupation = 0
    if total_rooms > 0:
        rooms_with_exams = Room.objects.filter(exam__isnull=False).distinct().count()
        room_occupation = (rooms_with_exams / total_rooms) * 100
    
    # Répartition des surveillants
    proctor_distribution = 0
    if total_proctors > 0:
        avg_proctors_per_exam = Exam.objects.filter(proctors__isnull=False).count() / total_proctors
        proctor_distribution = avg_proctors_per_exam * 100
    
    # Répartition par département
    departments = Exam.objects.values('department').distinct()
    exams_by_department = []
    
    for dept in departments:
        dept_name = dept['department']
        count = Exam.objects.filter(department=dept_name).count()
        percentage = (count / total_exams) * 100 if total_exams > 0 else 0
        
        exams_by_department.append({
            'department': dept_name,
            'count': count,
            'percentage': round(percentage, 1)
        })
    
    # Équilibrage des créneaux
    time_slot_balance = 0
    if TimeSlot.objects.count() > 0:
        # Calculer l'équilibre en fonction de la répartition des examens par créneau
        slots_with_exams = TimeSlot.objects.filter(exam__isnull=False).count()
        time_slot_balance = (slots_with_exams / TimeSlot.objects.count()) * 100
    
    return Response({
        'totalExams': total_exams,
        'totalRooms': total_rooms,
        'totalProctors': total_proctors,
        'roomOccupation': round(room_occupation, 1),
        'proctorDistribution': round(proctor_distribution, 1),
        'timeSlotBalance': round(time_slot_balance, 1),
        'examsByDepartment': exams_by_department
    })

@api_view(['POST'])
def schedule_exams(request):
    exams = Exam.objects.filter(room__isnull=True)
    rooms = Room.objects.all()
    proctors = Proctor.objects.all()
    time_slots = TimeSlot.objects.filter(exam__isnull=True)
    
    if not exams or not rooms or not proctors or not time_slots:
        return Response(
            {'error': 'Missing data for scheduling'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    scheduler = ExamScheduler(exams, rooms, proctors, time_slots)
    result = scheduler.create_schedule()
    
    if result['status'] == 'success':
        # Mettre à jour la base de données avec les résultats
        for item in result['results']:
            exam = Exam.objects.get(id=item['exam_id'])
            room = Room.objects.get(id=item['room_id'])
            time_slot = TimeSlot.objects.get(id=item['time_slot_id'])
            
            # Mettre à jour l'examen
            exam.room = room
            exam.save()
            
            # Ajouter les surveillants
            exam.proctors.clear()
            for proctor_id in item['proctor_ids']:
                proctor = Proctor.objects.get(id=proctor_id)
                exam.proctors.add(proctor)
            
            # Mettre à jour le créneau
            time_slot.exam = exam
            time_slot.start_time = item['start_time']
            time_slot.end_time = item['end_time']
            time_slot.room = room
            time_slot.save()
            
            # Mettre à jour le statut de la salle
            room.status = 'occupied'
            room.save()
        
        return Response({'status': 'success', 'scheduled_exams': len(result['results'])})
    else:
        return Response(
            {'status': 'failure', 'message': 'No feasible schedule found'},
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(['POST'])
def manual_schedule(request):
    exam_id = request.data.get('exam_id')
    room_id = request.data.get('room_id')
    time_slot_id = request.data.get('time_slot_id')
    proctor_ids = request.data.get('proctor_ids', [])
    
    if not all([exam_id, room_id, time_slot_id, proctor_ids]):
        return Response(
            {'error': 'Missing required fields'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        exam = Exam.objects.get(id=exam_id)
        room = Room.objects.get(id=room_id)
        time_slot = TimeSlot.objects.get(id=time_slot_id)
        
        # Assignation de la salle à l'examen
        exam.room = room
        exam.save()
        
        # Ajout des surveillants
        exam.proctors.clear()
        for proctor_id in proctor_ids:
            proctor = Proctor.objects.get(id=proctor_id)
            exam.proctors.add(proctor)
        
        # Mise à jour du créneau
        time_slot.exam = exam
        time_slot.room = room
        time_slot.save()
        
        # Mise à jour du statut de la salle
        room.status = 'occupied'
        room.save()
        
        return Response({'status': 'success', 'message': 'Exam scheduled successfully'})
    except Exception as e:
        return Response(
            {'status': 'failure', 'message': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
def generate_timeslots(request):
    """Générer des créneaux horaires pour les examens."""
    start_time_str = request.data.get('start_time', '08:00')
    end_time_str = request.data.get('end_time', '18:00')
    interval_minutes = int(request.data.get('interval_minutes', 30))
    
    try:
        # Obtenir la date actuelle
        today = timezone.now().date()
        
        # Créer les heures de début et de fin
        start_hour, start_minute = map(int, start_time_str.split(':'))
        end_hour, end_minute = map(int, end_time_str.split(':'))
        
        start_time = timezone.datetime.combine(today, timezone.datetime.min.time().replace(hour=start_hour, minute=start_minute))
        end_time = timezone.datetime.combine(today, timezone.datetime.min.time().replace(hour=end_hour, minute=end_minute))
        
        # Générer les créneaux
        current_time = start_time
        created_slots = []
        
        while current_time < end_time:
            next_time = current_time + timedelta(minutes=interval_minutes)
            
            # Créer un créneau horaire
            time_slot = TimeSlot.objects.create(
                start_time=current_time,
                end_time=next_time
            )
            
            created_slots.append({
                'id': time_slot.id,
                'start_time': time_slot.start_time,
                'end_time': time_slot.end_time
            })
            
            current_time = next_time
        
        return Response({
            'status': 'success',
            'message': f'Créé {len(created_slots)} créneaux horaires',
            'time_slots': created_slots
        })
    except Exception as e:
        return Response(
            {'status': 'failure', 'message': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )