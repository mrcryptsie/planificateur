from datetime import datetime

class Exam:
    def __init__(self, exam_id, duration, level, department):
        self.id = exam_id
        self.duration = duration  # Format "h:m" (par exemple "2h30")
        self.level = level  # Ex: "L3", "M1", etc.
        self.department = department  # Ex: "Informatique"
    
    def get_duration_in_minutes(self):
        hours, minutes = map(int, self.duration.split('h'))
        return hours * 60 + minutes

class Room:
    def __init__(self, room_id, capacity):
        self.id = room_id
        self.capacity = capacity  # Nombre d'étudiants que la salle peut accueillir

class Proctor:
    def __init__(self, proctor_id):
        self.id = proctor_id

class TimeSlot:
    def __init__(self, time_slot_id, start_time):
        self.id = time_slot_id
        self.start_time = start_time  # Heure de début (type datetime)
        
    def get_end_time(self, exam_duration_minutes):
        return self.start_time + timedelta(minutes=exam_duration_minutes)
