import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { LucideHome, LucideCalendar, LucideUsers, LucideLayoutDashboard, LucideSettings, LucideDownload } from "lucide-react";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <motion.nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="flex justify-around items-center py-3 px-4">
        <Link href="/">
          <a className={`flex flex-col items-center ${isActive('/') ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'}`}>
            <LucideHome className="h-5 w-5" />
            <span className="text-xs mt-1">Accueil</span>
          </a>
        </Link>
        
        <Link href="/dashboard">
          <a className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'}`}>
            <LucideLayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Tableau</span>
          </a>
        </Link>
        
        <Link href="/exams">
          <a className={`flex flex-col items-center ${isActive('/exams') ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'}`}>
            <LucideCalendar className="h-5 w-5" />
            <span className="text-xs mt-1">Examens</span>
          </a>
        </Link>
        
        <Link href="/rooms">
          <a className={`flex flex-col items-center ${isActive('/rooms') ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'}`}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7V19.5M4 7H20M4 7V4H20V7M20 7V19.5M4 19.5H20M4 19.5V22H20V19.5M8 11H16M8 15H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs mt-1">Salles</span>
          </a>
        </Link>
        
        <Link href="/proctors">
          <a className={`flex flex-col items-center ${isActive('/proctors') ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'}`}>
            <LucideUsers className="h-5 w-5" />
            <span className="text-xs mt-1">Surveillants</span>
          </a>
        </Link>
        
        <Link href="/scheduler">
          <a className={`flex flex-col items-center ${isActive('/scheduler') ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'}`}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M12 12L9 15M12 12L15 15M12 12V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs mt-1">Planifier</span>
          </a>
        </Link>
      </div>
    </motion.nav>
  );
}
