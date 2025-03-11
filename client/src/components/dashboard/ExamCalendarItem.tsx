import { motion } from "framer-motion";
import { Exam, Room, Proctor } from "@shared/schema";

interface ExamCalendarItemProps {
  exam: Exam & {
    room?: Room;
    proctors?: Proctor[];
  };
  onClick: () => void;
}

export default function ExamCalendarItem({ exam, onClick }: ExamCalendarItemProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatLevel = (level: string) => {
    return level.toUpperCase();
  };

  const formatDepartment = (department: string) => {
    return department.charAt(0).toUpperCase() + department.slice(1);
  };

  return (
    <motion.div 
      className="exam-card hover:bg-gray-50 p-4 sm:p-6 transition-all duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-700 font-semibold">
            {formatTime(exam.date.toString())}
          </div>
          <div>
            <h4 className="font-semibold text-dark-800 mb-1">{exam.name}</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800">
                <i className="fas fa-graduation-cap mr-1 text-xs"></i>
                {formatLevel(exam.level)} {formatDepartment(exam.department)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800">
                <i className="fas fa-clock mr-1 text-xs"></i>
                {exam.duration}
              </span>
              {exam.room && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-dark-800">
                  <i className="fas fa-door-open mr-1 text-xs"></i>
                  {exam.room.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {exam.proctors && exam.proctors.length > 0 && (
            <div className="flex -space-x-2">
              {exam.proctors.slice(0, 2).map((proctor, index) => (
                <img 
                  key={index}
                  src={proctor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(proctor.name)}&background=random`}
                  alt={proctor.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
          )}
          <button 
            className="btn-neon-accent ml-2 px-3 py-1 text-sm bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-all duration-300"
            onClick={onClick}
          >
            Détails
          </button>
        </div>
      </div>
    </motion.div>
  );
}
