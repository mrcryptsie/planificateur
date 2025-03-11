import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <motion.nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="flex justify-around items-center py-3 px-4">
        <Link href="/">
          <a className={`flex flex-col items-center ${isActive('/') ? 'text-primary-500' : 'text-dark-400 hover:text-primary-500 transition-colors'}`}>
            <i className="fas fa-home text-xl"></i>
            <span className="text-xs mt-1">Accueil</span>
          </a>
        </Link>
        
        <Link href="/exams">
          <a className={`flex flex-col items-center ${isActive('/exams') ? 'text-primary-500' : 'text-dark-400 hover:text-primary-500 transition-colors'}`}>
            <i className="fas fa-calendar-alt text-xl"></i>
            <span className="text-xs mt-1">Examens</span>
          </a>
        </Link>
        
        <Link href="/rooms">
          <a className={`flex flex-col items-center ${isActive('/rooms') ? 'text-primary-500' : 'text-dark-400 hover:text-primary-500 transition-colors'}`}>
            <i className="fas fa-door-open text-xl"></i>
            <span className="text-xs mt-1">Salles</span>
          </a>
        </Link>
        
        <Link href="/proctors">
          <a className={`flex flex-col items-center ${isActive('/proctors') ? 'text-primary-500' : 'text-dark-400 hover:text-primary-500 transition-colors'}`}>
            <i className="fas fa-user-shield text-xl"></i>
            <span className="text-xs mt-1">Surveillants</span>
          </a>
        </Link>
        
        <Link href="/settings">
          <a className={`flex flex-col items-center ${isActive('/settings') ? 'text-primary-500' : 'text-dark-400 hover:text-primary-500 transition-colors'}`}>
            <i className="fas fa-cog text-xl"></i>
            <span className="text-xs mt-1">Réglages</span>
          </a>
        </Link>
      </div>
    </motion.nav>
  );
}
