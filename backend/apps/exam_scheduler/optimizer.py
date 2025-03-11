from ortools.sat.python import cp_model
from datetime import timedelta

class ExamScheduler:
    def __init__(self, exams, rooms, proctors, time_slots):
        self.exams = exams
        self.rooms = rooms
        self.proctors = proctors
        self.time_slots = time_slots
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()

    def create_schedule(self):
        # Variables de décision
        X = {}  # X[e, r, t] = 1 si l'examen e est dans la salle r au créneau t
        Y = {}  # Y[e, p] = 1 si l'examen e est surveillé par le surveillant p

        # Initialisation des variables
        for e_idx, exam in enumerate(self.exams):
            for r_idx, room in enumerate(self.rooms):
                for t_idx, time_slot in enumerate(self.time_slots):
                    X[e_idx, r_idx, t_idx] = self.model.NewBoolVar(f'X_{e_idx}_{r_idx}_{t_idx}')

        for e_idx, exam in enumerate(self.exams):
            for p_idx, proctor in enumerate(self.proctors):
                Y[e_idx, p_idx] = self.model.NewBoolVar(f'Y_{e_idx}_{p_idx}')

        # 1. Chaque examen doit être affecté à une seule salle et un seul créneau
        for e_idx, exam in enumerate(self.exams):
            self.model.Add(sum(X[e_idx, r_idx, t_idx] for r_idx in range(len(self.rooms)) 
                              for t_idx in range(len(self.time_slots))) == 1)

        # 2. Respect de la durée des examens
        for e_idx, exam in enumerate(self.exams):
            # Conversion de la durée (ex: "2h30") en nombre de créneaux
            duration_parts = exam.duration.split('h')
            hours = int(duration_parts[0])
            minutes = int(duration_parts[1]) if len(duration_parts) > 1 and duration_parts[1] else 0
            total_minutes = hours * 60 + minutes

            # Calculer le nombre de créneaux nécessaires (en supposant des créneaux de 30 min)
            required_slots = (total_minutes + 29) // 30  # Arrondi au supérieur

            for r_idx in range(len(self.rooms)):
                for t_idx in range(len(self.time_slots) - required_slots + 1):
                    # Si l'examen commence à t_idx, il doit occuper les créneaux jusqu'à t_idx + required_slots
                    for dt in range(1, required_slots):
                        # Si X[e_idx, r_idx, t_idx] = 1, alors X[e_idx, r_idx, t_idx + dt] doit être 1
                        self.model.Add(X[e_idx, r_idx, t_idx + dt] >= X[e_idx, r_idx, t_idx])

        # 3. Une salle ne peut pas accueillir plus d'un examen en même temps
        for r_idx in range(len(self.rooms)):
            for t_idx in range(len(self.time_slots)):
                self.model.Add(sum(X[e_idx, r_idx, t_idx] for e_idx in range(len(self.exams))) <= 1)

        # 4. Un surveillant ne peut surveiller qu'un seul examen à la fois
        for p_idx in range(len(self.proctors)):
            for t_idx in range(len(self.time_slots)):
                exams_at_slot = []
                for e_idx in range(len(self.exams)):
                    for r_idx in range(len(self.rooms)):
                        if X[e_idx, r_idx, t_idx] == 1:
                            exams_at_slot.append(e_idx)
                if exams_at_slot:
                    self.model.Add(sum(Y[e_idx, p_idx] for e_idx in exams_at_slot) <= 1)

        # 5. Un examen doit être surveillé par au moins un surveillant
        for e_idx in range(len(self.exams)):
            self.model.Add(sum(Y[e_idx, p_idx] for p_idx in range(len(self.proctors))) >= 1)

        # 6. Les examens d'une même promotion ne peuvent pas être au même créneau
        for e1_idx in range(len(self.exams)):
            for e2_idx in range(e1_idx + 1, len(self.exams)):
                if self.exams[e1_idx].level == self.exams[e2_idx].level:
                    for t_idx in range(len(self.time_slots)):
                        # Si les deux examens sont programmés au même créneau
                        self.model.Add(
                            sum(X[e1_idx, r_idx, t_idx] for r_idx in range(len(self.rooms))) +
                            sum(X[e2_idx, r_idx, t_idx] for r_idx in range(len(self.rooms))) <= 1
                        )

        # 7. Une filière ne peut pas avoir deux examens en même temps (même promotions différentes)
        for e1_idx in range(len(self.exams)):
            for e2_idx in range(e1_idx + 1, len(self.exams)):
                if self.exams[e1_idx].department == self.exams[e2_idx].department:
                    for t_idx in range(len(self.time_slots)):
                        self.model.Add(
                            sum(X[e1_idx, r_idx, t_idx] for r_idx in range(len(self.rooms))) +
                            sum(X[e2_idx, r_idx, t_idx] for r_idx in range(len(self.rooms))) <= 1
                        )

        # Fonction Objective : Minimiser le nombre de créneaux utilisés et équilibrer la charge
        self.model.Minimize(
            sum(t_idx * X[e_idx, r_idx, t_idx] 
                for e_idx in range(len(self.exams)) 
                for r_idx in range(len(self.rooms)) 
                for t_idx in range(len(self.time_slots)))
        )

        # Résolution
        status = self.solver.Solve(self.model)

        # Traitement des résultats
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            results = []
            for e_idx, exam in enumerate(self.exams):
                for r_idx, room in enumerate(self.rooms):
                    for t_idx, time_slot in enumerate(self.time_slots):
                        if self.solver.Value(X[e_idx, r_idx, t_idx]) == 1:
                            # Trouver les surveillants assignés à cet examen
                            assigned_proctors = []
                            for p_idx, proctor in enumerate(self.proctors):
                                if self.solver.Value(Y[e_idx, p_idx]) == 1:
                                    assigned_proctors.append(proctor.id)

                            # Calculer la durée de l'examen
                            duration_parts = exam.duration.split('h')
                            hours = int(duration_parts[0])
                            minutes = int(duration_parts[1]) if len(duration_parts) > 1 and duration_parts[1] else 0

                            # Créer une entrée pour le résultat
                            results.append({
                                'exam_id': exam.id,
                                'room_id': room.id,
                                'time_slot_id': time_slot.id,
                                'start_time': time_slot.start_time,
                                'end_time': time_slot.start_time + timedelta(hours=hours, minutes=minutes),
                                'proctor_ids': assigned_proctors
                            })
            return {'status': 'success', 'results': results}
        else:
            return {'status': 'no_solution', 'results': []}