
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, datetime
from apps.exam_scheduler.models import TimeSlot

class Command(BaseCommand):
    help = 'Génère des créneaux horaires pour les examens'

    def handle(self, *args, **options):
        # Supprimer les créneaux existants
        TimeSlot.objects.all().delete()
        
        # Obtenir la date actuelle et les 4 jours suivants
        today = timezone.now().date()
        dates = [today + timedelta(days=i) for i in range(5)]
        
        # Définir les créneaux horaires par durée
        time_slots = {
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
        
        counter = 0
        
        # Créer les créneaux pour chaque date
        for date in dates:
            for duration, slots in time_slots.items():
                for start_time, end_time in slots:
                    start_hour, start_min = map(int, start_time.split(':'))
                    end_hour, end_min = map(int, end_time.split(':'))
                    
                    start_datetime = datetime.combine(date, datetime.min.time().replace(hour=start_hour, minute=start_min))
                    end_datetime = datetime.combine(date, datetime.min.time().replace(hour=end_hour, minute=end_min))
                    
                    # Ajouter le fuseau horaire
                    start_datetime = timezone.make_aware(start_datetime)
                    end_datetime = timezone.make_aware(end_datetime)
                    
                    # Créer le créneau avec une description
                    duration_text = duration
                    TimeSlot.objects.create(
                        start_time=start_datetime,
                        end_time=end_datetime
                    )
                    counter += 1
        
        self.stdout.write(self.style.SUCCESS(f'Créé {counter} créneaux horaires pour 5 jours'))
