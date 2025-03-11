from models import Exam, Room, Proctor, TimeSlot
from datetime import timedelta

class ExamScheduler:
    def __init__(self, exams, rooms, proctors, time_slots):
        self.exams = exams
        self.rooms = rooms
        self.proctors = proctors
        self.time_slots = time_slots

    def create_schedule(self):
        schedule = []
        for exam in self.exams:
            assigned_room = self.assign_room(exam)
            assigned_proctors = self.assign_proctors(exam)
            assigned_time_slot = self.assign_time_slot(exam)
            
            if not assigned_room or not assigned_proctors or not assigned_time_slot:
                return {"status": "error", "message": "Impossible de créer un emploi du temps valide."}
            
            end_time = assigned_time_slot.get_end_time(exam.get_duration_in_minutes())
            schedule.append({
                "exam_id": exam.id,
                "room_id": assigned_room.id,
                "start_time": assigned_time_slot.start_time,
                "end_time": end_time,
                "proctor_ids": [proctor.id for proctor in assigned_proctors]
            })
        
        return {"status": "success", "results": schedule}

    def assign_room(self, exam):
        available_rooms = [room for room in self.rooms if room.capacity >= 30]  # Exemple: seulement les salles >= 30 places
        return available_rooms[0] if available_rooms else None

    def assign_proctors(self, exam):
        return self.proctors[:2]  # Assigner les deux premiers surveillants

    def assign_time_slot(self, exam):
        return self.time_slots[0]  # Assigner le premier créneau horaire disponible
