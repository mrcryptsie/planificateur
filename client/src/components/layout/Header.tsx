import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { LucideCalendar, LucideLayoutDashboard, LucideUsers, LucideHome, 
  LucideSearch, LucideBell, LucideChevronDown, LucideCheck, LucideDownload } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { title: "Accueil", path: "/", icon: <LucideHome className="h-5 w-5" /> },
    { title: "Tableau de bord", path: "/dashboard", icon: <LucideLayoutDashboard className="h-5 w-5" /> },
    { title: "Examens", path: "/exams", icon: <LucideCalendar className="h-5 w-5" /> },
    { title: "Salles", path: "/rooms", icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7V19.5M4 7H20M4 7V4H20V7M20 7V19.5M4 19.5H20M4 19.5V22H20V19.5M8 11H16M8 15H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg> 
    },
    { title: "Surveillants", path: "/proctors", icon: <LucideUsers className="h-5 w-5" /> },
    { title: "Planificateur", path: "/scheduler", icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M12 12L9 15M12 12L15 15M12 12V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
    { title: "Conflits", path: "/conflicts", icon: <LucideCheck className="h-5 w-5" /> },
    { title: "Exporter", path: "/export", icon: <LucideDownload className="h-5 w-5" /> },
  ];

  return (
    <motion.header 
      className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <svg className="h-8 w-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.75 15L12 19.25L19.25 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.75 12L12 16.25L19.25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Link href="/">
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white cursor-pointer">ExamScheduler</span>
            </Link>
          </div>
          
          {/* Navigation menu */}
          <nav className="hidden md:ml-8 md:flex md:space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer
                  ${location === item.path 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-1.5">{item.title}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Right side header content */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 w-64 dark:text-white"
            />
            <LucideSearch className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
            <LucideBell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          
          {/* User profile */}
          <div className="flex items-center">
            <button className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="ml-2 font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Thomas Martin</span>
              <LucideChevronDown className="ml-2 h-4 w-4 text-gray-400 hidden sm:inline" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
