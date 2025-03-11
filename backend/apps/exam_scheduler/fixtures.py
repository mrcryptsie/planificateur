from datetime import datetime, timedelta
from django.utils import timezone
from .models import Room, Proctor, Exam, TimeSlot

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
    
    # Créer des créneaux horaires
    time_slots = []
    
    # Créneaux pour la journée 1
    day1 = now.replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=1)
    time_slots.append(
        TimeSlot.objects.create(
            room=rooms[1],
            start_time=day1 + timedelta(hours=9),
            end_time=day1 + timedelta(hours=11, minutes=30),
            exam=exams[0]
        )
    )
    
    # Créneaux pour la journée 2
    day2 = now.replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=2)
    time_slots.append(
        TimeSlot.objects.create(
            room=rooms[0],
            start_time=day2 + timedelta(hours=14),
            end_time=day2 + timedelta(hours=17),
            exam=exams[1]
        )
    )
    
    # Créneaux pour la journée 3
    day3 = now.replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=3)
    time_slots.append(
        TimeSlot.objects.create(
            room=rooms[2],
            start_time=day3 + timedelta(hours=10),
            end_time=day3 + timedelta(hours=14),
            exam=exams[2]
        )
    )
    
    # Créer des créneaux disponibles
    for i in range(3):
        day = now.replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=i+1)
        for hour in [8, 11, 15]:
            if not (i == 0 and hour == 9) and not (i == 1 and hour == 14) and not (i == 2 and hour == 10):
                TimeSlot.objects.create(
                    start_time=day + timedelta(hours=hour),
                    end_time=day + timedelta(hours=hour+2),
                )
    
    return {
        'rooms': rooms,
        'proctors': proctors,
        'exams': exams,
        'time_slots': time_slots
    }