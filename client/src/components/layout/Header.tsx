import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header 
      className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50"
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
            <span className="ml-2 text-xl font-semibold text-dark-900">ExamManager</span>
          </div>
        </div>
        
        {/* Right side header content */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-300 w-64"
            />
            <i className="fas fa-search text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
          </div>
          
          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <i className="fas fa-bell text-dark-600"></i>
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
              <span className="ml-2 font-medium text-dark-700 hidden sm:inline">Thomas Martin</span>
              <i className="fas fa-chevron-down ml-2 text-xs text-dark-400 hidden sm:inline"></i>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
