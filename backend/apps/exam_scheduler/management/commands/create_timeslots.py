
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, datetime
from apps.exam_scheduler.models import TimeSlot

class Command(BaseCommand):
    help = 'Génère des créneaux horaires pour les examens'

    def handle(self, *args, **options):
        # Supprimer les créneaux existants
        TimeSlot.objects.all().delete()
        
        today = timezone.now().date()
        
        # Définir les durées d'examen et les créneaux correspondants
        exam_slots = {
            "1h": [
                ("08:00", "09:00"), ("09:00", "10:00"), ("10:00", "11:00"),
                ("11:00", "12:00"), ("12:00", "13:00"), ("13:00", "14:00"),
                ("14:00", "15:00"), ("15:00", "16:00"), ("16:00", "17:00"),
                ("17:00", "18:00")
            ],
            "2h": [
                ("08:00", "10:00"), ("09:00", "11:00"), ("10:00", "12:00"),
                ("11:00", "13:00"), ("12:00", "14:00"), ("13:00", "15:00"),
                ("14:00", "16:00"), ("15:00", "17:00"), ("16:00", "18:00")
            ],
            "3h": [
                ("08:00", "11:00"), ("09:00", "12:00"), ("10:00", "13:00"),
                ("11:00", "14:00"), ("12:00", "15:00"), ("13:00", "16:00"),
                ("14:00", "17:00"), ("15:00", "18:00")
            ]
        }
        
        # Générer des créneaux pour les 5 prochains jours
        days = 5
        counter = 0
        
        for i in range(days):
            date = today + timedelta(days=i)
            
            for duration, slots in exam_slots.items():
                for start, end in slots:
                    start_hour, start_min = map(int, start.split(':'))
                    end_hour, end_min = map(int, end.split(':'))
                    
                    start_time = datetime.combine(date, datetime.min.time().replace(hour=start_hour, minute=start_min))
                    end_time = datetime.combine(date, datetime.min.time().replace(hour=end_hour, minute=end_min))
                    
                    # Ajouter le fuseau horaire
                    start_time = timezone.make_aware(start_time)
                    end_time = timezone.make_aware(end_time)
                    
                    # Créer le créneau
                    TimeSlot.objects.create(
                        start_time=start_time,
                        end_time=end_time
                    )
                    counter += 1
        
        self.stdout.write(self.style.SUCCESS(f'Créé {counter} créneaux horaires'))
