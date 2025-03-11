from datetime import datetime, timedelta
from django.utils import timezone
from backend.apps.exam_scheduler.models import Room, Proctor, Exam, TimeSlot
from random import choice

def create_sample_fixtures():
    """
    Crée des données d'exemple pour l'application
    """
    fixtures = {
        'rooms': [],
        'proctors': [],
        'exams': [],
        'timeslots': []  # Renommé de 'time_slots' à 'timeslots' pour correspondre à ce qui est attendu
    }

    # Créer quelques salles
    rooms = [
        Room.objects.create(
            name=f"Salle {i}", 
            capacity=30 + i*10, 
            status='available'
        ) 
        for i in range(1, 4)
    ]
    fixtures['rooms'] = rooms

    # Créer quelques surveillants
    proctors = [
        Proctor.objects.create(
            name=f"Surveillant {i}", 
            department=["Informatique", "Mathématiques", "Physique"][i-1]
        ) for i in range(1, 4)
    ]
    fixtures['proctors'] = proctors

    # Créer quelques examens
    exams = [
        Exam.objects.create(
            name=f"Examen {i}",
            date=timezone.now() + timedelta(days=i),
            duration="2h00",
            participants=25 + i*5,
            level=f"L{i}",
            department=["Informatique", "Mathématiques", "Physique"][i-1]
        ) for i in range(1, 4)
    ]
    fixtures['exams'] = exams

    return fixtures

def create_default_timeslots():
    """
    Crée des créneaux horaires par défaut
    """
    # Supprimer les créneaux existants
    TimeSlot.objects.all().delete()

    # Date de début (aujourd'hui)
    start_date = timezone.now().replace(hour=8, minute=0, second=0, microsecond=0)

    # Créer des créneaux pour 3 jours, de 8h à 18h, avec des intervalles de 30 minutes
    timeslots_created = 0
    for day in range(4):  # 4 jours
        day_start = start_date + timedelta(days=day)
        for hour in range(8, 18):  # De 8h à 18h
            for minute in [0, 30]:  # Intervalles de 30 minutes
                start_time = day_start.replace(hour=hour, minute=minute)
                end_time = start_time + timedelta(minutes=30)

                TimeSlot.objects.create(
                    start_time=start_time,
                    end_time=end_time
                )
                timeslots_created += 1

    print(f"Créé {timeslots_created} créneaux horaires par défaut")
    return timeslots_created

def generate_fixtures():
    """Générer des données d'exemple pour l'application"""
    # Créer des salles, surveillants et examens en utilisant la nouvelle fonction
    sample_fixtures = create_sample_fixtures()
    rooms = sample_fixtures['rooms']
    proctors = sample_fixtures['proctors']
    exams = sample_fixtures['exams']

    # Créer des créneaux par défaut
    create_default_timeslots()

    return {
        'rooms': rooms,
        'proctors': proctors,
        'exams': exams
    }