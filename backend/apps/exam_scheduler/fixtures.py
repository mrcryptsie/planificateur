from datetime import datetime, timedelta
from django.utils import timezone
from .models import Room, Proctor, Exam, TimeSlot

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
    """
    Génère des données initiales pour tester l'application.
    """
    # Supprimer les données existantes
    TimeSlot.objects.all().delete()
    Exam.objects.all().delete()
    Proctor.objects.all().delete()
    Room.objects.all().delete()
    
    # Créer des salles
    rooms = [
        Room.objects.create(
            name="Amphi A",
            capacity=150,
            occupancy_rate=85,
            status="available"
        ),
        Room.objects.create(
            name="Salle 103",
            capacity=50,
            occupancy_rate=42,
            status="partially_occupied"
        ),
        Room.objects.create(
            name="Labo L2",
            capacity=30,
            occupancy_rate=95,
            status="occupied"
        )
    ]
    
    # Créer des surveillants
    proctors = [
        Proctor.objects.create(
            name="Dr. Sophie Martin",
            department="informatique",
            availability=["2023-06-15", "2023-06-16", "2023-06-17"],
            avatar_url="https://randomuser.me/api/portraits/women/44.jpg"
        ),
        Proctor.objects.create(
            name="Prof. Jean Dupont",
            department="mathematiques",
            availability=["2023-06-15", "2023-06-16"],
            avatar_url="https://randomuser.me/api/portraits/men/32.jpg"
        ),
        Proctor.objects.create(
            name="Dr. Laura Blanc",
            department="physique",
            availability=["2023-06-16", "2023-06-17", "2023-06-18"],
            avatar_url="https://randomuser.me/api/portraits/women/68.jpg"
        )
    ]
    
    # Créer des examens
    now = timezone.now()
    exams = [
        Exam.objects.create(
            name="Algorithmes et Structures de Données",
            date=now + timedelta(days=1, hours=9),
            level="l2",
            department="informatique",
            duration="2h30",
            participants=45,
            room=rooms[1]  # Salle 103
        ),
        Exam.objects.create(
            name="Analyse Mathématique",
            date=now + timedelta(days=2, hours=14),
            level="l1",
            department="mathematiques",
            duration="3h00",
            participants=120,
            room=rooms[0]  # Amphi A
        ),
        Exam.objects.create(
            name="Mécanique Quantique",
            date=now + timedelta(days=3, hours=10),
            level="m1",
            department="physique",
            duration="4h00",
            participants=28,
            room=rooms[2]  # Labo L2
        )
    ]
    
    # Associer les surveillants aux examens
    exams[0].proctors.add(proctors[0])
    exams[1].proctors.add(proctors[1], proctors[2])
    exams[2].proctors.add(proctors[2])
    
    # Créer des créneaux horaires -  This section is now handled by create_default_timeslots
    create_default_timeslots()


    return {
        'rooms': rooms,
        'proctors': proctors,
        'exams': exams,
        #'time_slots': time_slots  Removed as timeslots are now created by create_default_timeslots
    }