import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: number | string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: string;
  color: "primary" | "secondary" | "accent";
}

const colorClasses = {
  primary: {
    bg: "bg-primary-100",
    text: "text-primary-500",
  },
  secondary: {
    bg: "bg-secondary-100",
    text: "text-secondary-500",
  },
  accent: {
    bg: "bg-accent-100",
    text: "text-accent-500",
  },
};

export default function StatsCard({ title, value, trend, icon, color }: StatsCardProps) {
  const colorClass = colorClasses[color];

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-card p-6 border border-gray-100 exam-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-dark-500 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-dark-900">{value}</h3>
          {trend && (
            <p className={`${trend.isPositive ? "text-secondary-500" : "text-accent-500"} text-sm font-medium mt-1`}>
              <i className={`fas fa-arrow-${trend.isPositive ? "up" : "down"} mr-1`}></i>
              <span>{trend.value}</span>
            </p>
          )}
        </div>
        <div className={`p-3 ${colorClass.bg} rounded-lg ${colorClass.text}`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
      </div>
    </motion.div>
  );
}
