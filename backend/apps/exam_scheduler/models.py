from django.db import models

class Room(models.Model):
    ROOM_STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('partially_occupied', 'Partiellement occupée'),
        ('occupied', 'Occupée'),
    ]
    
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    occupancy_rate = models.FloatField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=ROOM_STATUS_CHOICES,
        default='available'
    )
    
    def __str__(self):
        return f"{self.name} ({self.capacity} places)"


class Proctor(models.Model):
    DEPARTMENT_CHOICES = [
        ('informatique', 'Informatique'),
        ('mathematiques', 'Mathématiques'),
        ('physique', 'Physique'),
        ('chimie', 'Chimie'),
        ('biologie', 'Biologie'),
        ('autres', 'Autres'),
    ]
    
    name = models.CharField(max_length=100)
    department = models.CharField(
        max_length=20,
        choices=DEPARTMENT_CHOICES,
    )
    availability = models.JSONField(null=True, blank=True)
    avatar_url = models.URLField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_department_display()})"


class Exam(models.Model):
    LEVEL_CHOICES = [
        ('l1', 'L1'),
        ('l2', 'L2'),
        ('l3', 'L3'),
        ('m1', 'M1'),
        ('m2', 'M2'),
    ]
    
    DEPARTMENT_CHOICES = [
        ('informatique', 'Informatique'),
        ('mathematiques', 'Mathématiques'),
        ('physique', 'Physique'),
        ('chimie', 'Chimie'),
        ('biologie', 'Biologie'),
        ('autres', 'Autres'),
    ]
    
    name = models.CharField(max_length=255)
    date = models.DateTimeField()
    level = models.CharField(
        max_length=5,
        choices=LEVEL_CHOICES,
    )
    department = models.CharField(
        max_length=20,
        choices=DEPARTMENT_CHOICES,
    )
    duration = models.CharField(max_length=50)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    participants = models.IntegerField(null=True, blank=True)
    proctors = models.ManyToManyField(Proctor, blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.get_level_display()} {self.get_department_display()}"


class TimeSlot(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        room_name = self.room.name if self.room else "Aucune salle"
        exam_name = self.exam.name if self.exam else "Aucun examen"
        return f"{room_name} - {self.start_time.strftime('%d/%m/%Y %H:%M')} - {exam_name}"