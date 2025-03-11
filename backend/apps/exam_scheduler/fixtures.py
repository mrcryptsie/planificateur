from datetime import datetime, timedelta
from django.utils import timezone
from backend.apps.exam_scheduler.models import Room, Proctor, Exam, TimeSlot

def create_default_timeslots():
    """Crée des créneaux horaires par défaut si aucun n'existe"""
    if TimeSlot.objects.count() == 0:
        # Date actuelle
        today = timezone.now().date()

        # Définir les créneaux horaires
        time_slots = [
            # Jour 1
            {"start": "08:00", "end": "09:30", "date": today},
            {"start": "10:00", "end": "11:30", "date": today},
            {"start": "14:00", "end": "15:30", "date": today},
            {"start": "16:00", "end": "17:30", "date": today},

            # Jour 2
            {"start": "08:00", "end": "09:30", "date": today + timedelta(days=1)},
            {"start": "10:00", "end": "11:30", "date": today + timedelta(days=1)},
            {"start": "14:00", "end": "15:30", "date": today + timedelta(days=1)},
            {"start": "16:00", "end": "17:30", "date": today + timedelta(days=1)},

            # Jour 3
            {"start": "08:00", "end": "09:30", "date": today + timedelta(days=2)},
            {"start": "10:00", "end": "11:30", "date": today + timedelta(days=2)},
            {"start": "14:00", "end": "15:30", "date": today + timedelta(days=2)},
            {"start": "16:00", "end": "17:30", "date": today + timedelta(days=2)},
        ]

        # Créer les créneaux dans la base de données
        for slot in time_slots:
            start_hour, start_min = map(int, slot["start"].split(':'))
            end_hour, end_min = map(int, slot["end"].split(':'))

            start_datetime = datetime.combine(slot["date"], datetime.min.time().replace(hour=start_hour, minute=start_min))
            end_datetime = datetime.combine(slot["date"], datetime.min.time().replace(hour=end_hour, minute=end_min))

            # Ajouter le fuseau horaire
            start_datetime = timezone.make_aware(start_datetime)
            end_datetime = timezone.make_aware(end_datetime)

            TimeSlot.objects.create(
                start_time=start_datetime,
                end_time=end_datetime
            )

        print(f"Créé {len(time_slots)} créneaux horaires par défaut")

def generate_fixtures():
    """Générer des données d'exemple pour l'application"""
    # Créer des salles
    rooms = []
    if Room.objects.count() == 0:
        rooms = [
            Room.objects.create(name="A101", capacity=30, status="available"),
            Room.objects.create(name="B202", capacity=50, status="available"),
            Room.objects.create(name="C303", capacity=75, status="available"),
        ]

    # Créer des surveillants
    proctors = []
    if Proctor.objects.count() == 0:
        proctors = [
            Proctor.objects.create(name="Jean Dupont", email="jean.dupont@example.com"),
            Proctor.objects.create(name="Marie Martin", email="marie.martin@example.com"),
            Proctor.objects.create(name="Pierre Durand", email="pierre.durand@example.com"),
        ]

    # Créer des examens
    exams = []
    if Exam.objects.count() == 0:
        exams = [
            Exam.objects.create(name="Mathématiques Avancées", duration="2h00", department="Mathématiques", level="L3"),
            Exam.objects.create(name="Introduction à la Chimie", duration="1h30", department="Chimie", level="L1"),
            Exam.objects.create(name="Programmation Web", duration="3h00", department="Informatique", level="M1"),
        ]

    # Créer des créneaux par défaut
    create_default_timeslots()

    return {
        'rooms': rooms,
        'proctors': proctors,
        'exams': exams
    }