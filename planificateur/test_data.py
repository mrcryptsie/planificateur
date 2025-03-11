from datetime import datetime

# Données fictives
exams = [
    Exam(exam_id=1, duration="2h30", level="L3", department="Informatique"),
    Exam(exam_id=2, duration="1h", level="L1", department="Informatique"),
    Exam(exam_id=3, duration="2h", level="L3", department="Mathématiques"),
]

rooms = [
    Room(room_id=1, capacity=30),
    Room(room_id=2, capacity=25),
    Room(room_id=3, capacity=20),
]

proctors = [
    Proctor(proctor_id=1),
    Proctor(proctor_id=2),
    Proctor(proctor_id=3),
]

time_slots = [
    TimeSlot(time_slot_id=1, start_time=datetime(2025, 3, 11, 8, 0)),  # 8:00 AM
    TimeSlot(time_slot_id=2, start_time=datetime(2025, 3, 11, 10, 0)),  # 10:00 AM
    TimeSlot(time_slot_id=3, start_time=datetime(2025, 3, 11, 14, 0)),  # 2:00 PM
]
