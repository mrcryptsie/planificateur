from scheduler import ExamScheduler
from test_data import exams, rooms, proctors, time_slots

def main():
    scheduler = ExamScheduler(exams, rooms, proctors, time_slots)
    results = scheduler.create_schedule()

    if results['status'] == 'success':
        for result in results['results']:
            print(f"Examen {result['exam_id']} dans la salle {result['room_id']} à {result['start_time']} - {result['end_time']}")
            print(f"Surveillants assignés: {', '.join(map(str, result['proctor_ids']))}")
    else:
        print(results['message'])

if __name__ == "__main__":
    main()
