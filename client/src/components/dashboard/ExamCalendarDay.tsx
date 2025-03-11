import { motion } from "framer-motion";
import { useState } from "react";
import ExamCalendarItem from "./ExamCalendarItem";
import { Exam, Room, Proctor } from "@shared/schema";

interface ExamCalendarDayProps {
  date: string;
  exams: (Exam & { room?: Room; proctors?: Proctor[] })[];
  onExamClick: (exam: Exam & { room?: Room; proctors?: Proctor[] }) => void;
  preview?: boolean;
}

export default function ExamCalendarDay({ date, exams, onExamClick, preview = false }: ExamCalendarDayProps) {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // If preview mode, just show a button to expand the day
  if (preview) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
          <h3 className="font-semibold text-dark-800">{formatDate(date)}</h3>
          <span className="text-sm text-dark-500">{exams.length} examens</span>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <button 
              className="btn-neon px-6 py-2 bg-white border border-primary-500 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
              onClick={() => setExpanded(true)}
            >
              Afficher les examens
              <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get display exams (all if expanded, or just first 3)
  const displayExams = expanded ? exams : exams.slice(0, 3);
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-dark-800">{formatDate(date)}</h3>
        <span className="text-sm text-dark-500">{exams.length} examens</span>
      </div>
      
      <motion.div 
        className="divide-y divide-gray-100"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {displayExams.map((exam) => (
          <ExamCalendarItem 
            key={exam.id} 
            exam={exam} 
            onClick={() => onExamClick(exam)}
          />
        ))}
      </motion.div>
      
      {exams.length > 3 && (
        <div className="px-6 py-3 bg-gray-50 text-center">
          <button 
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded 
              ? "Réduire la liste"
              : `Voir tous les examens de cette journée (${exams.length - 3} de plus)`}
            <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} ml-1`}></i>
          </button>
        </div>
      )}
    </motion.div>
  );
}
