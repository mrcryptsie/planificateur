import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface StatProps {
  label: string;
  value: number;
  color: string;
}

const ProgressBar = ({ label, value, color }: StatProps) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm text-dark-500">{label}</span>
      <span className="text-sm font-medium text-dark-700">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div 
        className={`${color} h-2 rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      ></motion.div>
    </div>
  </div>
);

export default function AnalyticsSummary() {
  const { data: stats = { 
    roomOccupation: 72,
    proctorDistribution: 85,
    timeSlotBalance: 64,
    examsByDepartment: [
      { department: 'informatique', count: 42, percentage: 42 },
      { department: 'mathematiques', count: 25, percentage: 25 },
      { department: 'autres', count: 33, percentage: 33 }
    ]
  }, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

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
    <motion.div 
      className="mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h2 
        className="text-xl font-semibold text-dark-900 mb-4"
        variants={item}
      >
        Statistiques et Optimisation
      </motion.h2>
      
      <motion.div 
        className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100"
        variants={item}
      >
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-dark-800 mb-4">Répartition des examens par filière</h3>
              <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Background circle */}
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#e2e8f0" strokeWidth="30" />
                    
                    {/* Dynamic segments - calculated based on stats */}
                    {stats.examsByDepartment?.map((item, index) => {
                      // Calculate stroke dasharray and stroke dashoffset
                      const radius = 70;
                      const circumference = 2 * Math.PI * radius;
                      
                      // First segment starts at the top (90 degrees)
                      let startOffset = 0;
                      for (let i = 0; i < index; i++) {
                        startOffset += (stats.examsByDepartment[i].percentage / 100) * circumference;
                      }
                      
                      // Colors for the segments
                      const colors = ['#6366f1', '#10b981', '#f97316'];
                      
                      return (
                        <circle 
                          key={index}
                          cx="100" 
                          cy="100" 
                          r="70" 
                          fill="none" 
                          stroke={colors[index % colors.length]} 
                          strokeWidth="30" 
                          strokeDasharray={circumference} 
                          strokeDashoffset={circumference - (item.percentage / 100) * circumference}
                          transform={`rotate(-90 100 100)`} 
                          style={{ 
                            strokeDashoffset: `${circumference - startOffset - (item.percentage / 100) * circumference}`,
                            transition: 'stroke-dashoffset 1s ease-in-out'
                          }} 
                        />
                      );
                    })}
                    
                    {/* Center text */}
                    <text x="100" y="105" textAnchor="middle" fontSize="18" fontWeight="600" fill="#1f2937">
                      {stats.examsByDepartment?.[0]?.percentage || 0}%
                    </text>
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {stats.examsByDepartment?.map((item, index) => {
                  const colors = ['bg-primary-500', 'bg-secondary-500', 'bg-accent-500'];
                  const departments = {
                    'informatique': 'Informatique',
                    'mathematiques': 'Mathématiques',
                    'autres': 'Autres',
                  };
                  
                  return (
                    <div key={index} className="flex items-center">
                      <span className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-2`}></span>
                      <span className="text-sm text-dark-600">{departments[item.department as keyof typeof departments]} ({item.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Optimization Status */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-dark-800 mb-4">Performance de planification</h3>
              <div className="bg-gray-50 rounded-lg p-6 flex-1">
                <ProgressBar label="Optimisation des salles" value={stats.roomOccupation} color="bg-primary-500" />
                <ProgressBar label="Répartition des surveillants" value={stats.proctorDistribution} color="bg-secondary-500" />
                <ProgressBar label="Équilibre des créneaux" value={stats.timeSlotBalance} color="bg-accent-500" />
                
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button className="btn-neon w-full bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2.5 transition-all duration-300">
                    <i className="fas fa-magic mr-2"></i>
                    Optimiser la planification
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
