import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Exam, Room, Proctor } from "@shared/schema";
import Header from "@/components/layout/Header";
import MobileNavbar from "@/components/layout/MobileNavbar";
import StatsCard from "@/components/dashboard/StatsCard";
import FilterControls from "@/components/dashboard/FilterControls";
import ExamCalendarDay from "@/components/dashboard/ExamCalendarDay";
import RoomCard from "@/components/dashboard/RoomCard";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import ExamDetailsModal from "@/components/modals/ExamDetailsModal";
import { useGsapTransition } from "@/hooks/useGsapTransition";

export default function Dashboard() {
  // Set up GSAP transition on page load
  useGsapTransition();
  
  const [selectedExam, setSelectedExam] = useState<(Exam & { room?: Room; proctors?: Proctor[] }) | null>(null);
  const [filters, setFilters] = useState({
    level: '',
    department: '',
    period: '',
  });
  
  // Fetch exams with the applied filters
  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['/api/exams', filters.level, filters.department, filters.period],
  });
  
  // Fetch rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['/api/rooms'],
  });
  
  // Fetch stats
  const { data: stats = { totalExams: 127, totalRooms: 42, totalProctors: 68 }, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Group exams by date
  const examsByDate = exams.reduce((acc: Record<string, any[]>, exam: Exam) => {
    const dateKey = new Date(exam.date).toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(exam);
    return acc;
  }, {});
  
  // Sort dates
  const sortedDates = Object.keys(examsByDate).sort();
  
  // Handle filter submission
  const handleFilter = (newFilters: { level: string; department: string; period: string }) => {
    setFilters(newFilters);
  };
  
  // Handle opening the exam details modal
  const handleExamClick = (exam: Exam & { room?: Room; proctors?: Proctor[] }) => {
    setSelectedExam(exam);
  };
  
  // Handle opening the room details
  const handleRoomClick = (room: Room) => {
    // Future implementation for room details
    console.log('Room clicked:', room);
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <Header />
      
      <main className="pt-20 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Gestion des Examens</h1>
          <p className="text-dark-500">Planifiez et optimisez votre calendrier d'examens efficacement</p>
        </motion.div>
        
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <StatsCard 
            title="Examens planifiés" 
            value={stats.totalExams}
            trend={{ value: "+4.6% depuis le mois dernier", isPositive: true }}
            icon="fa-file-alt"
            color="primary"
          />
          
          <StatsCard 
            title="Salles utilisées" 
            value={stats.totalRooms}
            trend={{ value: "+2.1% d'occupation", isPositive: true }}
            icon="fa-door-open"
            color="secondary"
          />
          
          <StatsCard 
            title="Surveillants actifs" 
            value={stats.totalProctors}
            trend={{ value: "-1.4% en attente", isPositive: false }}
            icon="fa-user-shield"
            color="accent"
          />
        </motion.div>
        
        {/* Filter Controls */}
        <FilterControls onFilter={handleFilter} />
        
        {/* Exams Dashboard */}
        <motion.h2 
          className="text-xl font-semibold text-dark-900 mb-4"
          variants={item}
          initial="hidden"
          animate="show"
        >
          Calendrier des examens
        </motion.h2>
        
        {examsLoading ? (
          <div className="text-center py-8">
            <p className="text-dark-500">Chargement des examens...</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {sortedDates.map((dateKey, index) => (
              <ExamCalendarDay 
                key={dateKey}
                date={dateKey}
                exams={examsByDate[dateKey]}
                onExamClick={handleExamClick}
                preview={index > 0} // First day expanded, others in preview mode
              />
            ))}
            
            {sortedDates.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-dark-500">Aucun examen trouvé avec les filtres actuels.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Room Management Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-dark-900">Gestion des Salles</h2>
            <button className="btn-neon text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 transition-all duration-300">
              <i className="fas fa-plus mr-2"></i>
              Ajouter une salle
            </button>
          </div>
          
          {roomsLoading ? (
            <div className="text-center py-8">
              <p className="text-dark-500">Chargement des salles...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.slice(0, 3).map((room: Room) => (
                  <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
                ))}
              </div>
              
              {rooms.length > 3 && (
                <div className="mt-4 text-center">
                  <button className="text-primary-600 hover:text-primary-800 font-medium">
                    Afficher toutes les salles
                    <i className="fas fa-chevron-down ml-1"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Analytics Summary */}
        <AnalyticsSummary />
      </main>
      
      <MobileNavbar />
      
      {/* Exam Details Modal */}
      <ExamDetailsModal 
        exam={selectedExam}
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
      />
    </>
  );
}
