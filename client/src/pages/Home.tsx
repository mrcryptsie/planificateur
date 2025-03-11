import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LucideCalendar, LucideUsers, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Fonction simple d'animation
    const animateElement = (element: HTMLElement, delay = 0) => {
      gsap.fromTo(
        element,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          delay, 
          ease: "power3.out" 
        }
      );
    };
    
    if (heroRef.current) animateElement(heroRef.current);
    if (featuresRef.current) animateElement(featuresRef.current, 0.3);
    if (ctaRef.current) animateElement(ctaRef.current, 0.5);
  }, []);
  
  return (
    <div className="space-y-16 pb-12">
      {/* Hero section */}
      <section 
        ref={heroRef} 
        className="relative overflow-hidden py-12 md:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Plateforme de gestion et planification d'examens
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Organisez et planifiez efficacement les examens universitaires grâce à notre solution
            qui optimise l'allocation des salles et la répartition des surveillants.
          </motion.p>
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={() => setLocation('/scheduler')}
            >
              Commencer la planification
              <LucideArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setLocation('/dashboard')}
            >
              Voir le tableau de bord
            </Button>
          </motion.div>
        </div>
        
        {/* Abstract background shape */}
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-primary-100 dark:bg-primary-900/30 rounded-full opacity-50 filter blur-3xl"></div>
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-secondary-100 dark:bg-secondary-900/30 rounded-full opacity-50 filter blur-3xl"></div>
      </section>
      
      {/* Features section */}
      <section ref={featuresRef} className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Fonctionnalités principales
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Tout ce dont vous avez besoin pour une gestion optimale des examens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                <LucideCalendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Gestion des examens</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ajoutez et modifiez facilement les examens avec leurs contraintes spécifiques.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                <LucideLayoutDashboard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Gestion des salles</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Configurez les salles disponibles avec leurs capacités et caractéristiques.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                <LucideUsers className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Gestion des surveillants</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gérez les disponibilités et les compétences des surveillants d'examens.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section ref={ctaRef} className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 dark:bg-primary-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Prêt à optimiser votre planification ?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-primary-100">
                  Commencez à utiliser notre planificateur automatique pour résoudre vos contraintes
                  et générer un calendrier optimal pour vos examens.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="sm:flex">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-700 hover:bg-gray-100 shadow-md"
                    onClick={() => setLocation('/exams')}
                  >
                    Gérer les examens
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}