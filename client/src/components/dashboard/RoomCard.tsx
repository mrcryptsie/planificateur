import { motion } from "framer-motion";
import { Room } from "@shared/schema";

interface RoomCardProps {
  room: Room;
  onClick: (room: Room) => void;
}

export default function RoomCard({ room, onClick }: RoomCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">Disponible</span>;
      case 'partially_occupied':
        return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Partiellement occupée</span>;
      case 'occupied':
        return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-medium">Occupée</span>;
      default:
        return null;
    }
  };

  // Calculate the estimated number of exams based on occupancy
  const estimatedExams = Math.round(room.occupancyRate / 10);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-card p-4 border border-gray-100 exam-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-dark-800">{room.name}</h3>
        {getStatusBadge(room.status)}
      </div>
      <div className="mb-4">
        <div className="flex items-center text-dark-500 mb-1">
          <i className="fas fa-users mr-2 text-primary-500"></i>
          <span>Capacité: {room.capacity} étudiants</span>
        </div>
        <div className="flex items-center text-dark-500 mb-1">
          <i className="fas fa-calendar-check mr-2 text-primary-500"></i>
          <span>Taux d'occupation: {room.occupancyRate}%</span>
        </div>
        <div className="flex items-center text-dark-500">
          <i className="fas fa-clipboard-list mr-2 text-primary-500"></i>
          <span>Examens planifiés: {estimatedExams}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          onClick={() => onClick(room)}
        >
          Voir les détails
          <i className="fas fa-arrow-right ml-1"></i>
        </button>
      </div>
    </motion.div>
  );
}
