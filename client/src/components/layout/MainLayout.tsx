import React from "react";
import Header from "./Header";
import MobileNavbar from "./MobileNavbar";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="pt-16 pb-16 md:pb-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-6"
        >
          {children}
        </motion.div>
      </main>
      <MobileNavbar />
    </div>
  );
}