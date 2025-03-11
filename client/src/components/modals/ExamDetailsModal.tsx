import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Exam, Room, Proctor } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface ExamDetailsModalProps {
  exam?: (Exam & { room?: Room; proctors?: Proctor[] }) | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamDetailsModal({ exam, isOpen, onClose }: ExamDetailsModalProps) {
  if (!exam) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatLevel = (level: string) => {
    return level.toUpperCase();
  };

  const formatDepartment = (department: string) => {
    return department.charAt(0).toUpperCase() + department.slice(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                  <i className="fas fa-file-alt text-primary-600"></i>
                </div>
                <DialogTitle className="text-lg leading-6 font-medium text-dark-900">
                  {exam.name}
                </DialogTitle>
              </div>
            </DialogHeader>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-dark-600">
                    <i className="fas fa-graduation-cap w-5 mr-2 text-primary-500"></i>
                    <span>{formatLevel(exam.level)} {formatDepartment(exam.department)}</span>
                  </div>
                  <div className="flex items-center text-dark-600">
                    <i className="fas fa-calendar-day w-5 mr-2 text-primary-500"></i>
                    <span>{formatDate(exam.date.toString())}</span>
                  </div>
                  <div className="flex items-center text-dark-600">
                    <i className="fas fa-clock w-5 mr-2 text-primary-500"></i>
                    <span>Durée: {exam.duration}</span>
                  </div>
                  {exam.room && (
                    <div className="flex items-center text-dark-600">
                      <i className="fas fa-door-open w-5 mr-2 text-primary-500"></i>
                      <span>{exam.room.name} ({exam.room.capacity} places)</span>
                    </div>
                  )}
                  <div className="flex items-center text-dark-600">
                    <i className="fas fa-users w-5 mr-2 text-primary-500"></i>
                    <span>Participants: {exam.participants} étudiants</span>
                  </div>
                </div>
              </div>
              
              {exam.proctors && exam.proctors.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-dark-900 mb-2">Surveillants</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {exam.proctors.map((proctor, index) => (
                      <div key={index} className="flex items-center space-x-3 mb-2 last:mb-0">
                        <img 
                          src={proctor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(proctor.name)}&background=random`}
                          alt={proctor.name} 
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-dark-800">{proctor.name}</p>
                          <p className="text-sm text-dark-500">Département de {formatDepartment(proctor.department)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            
            <DialogFooter className="sm:flex sm:flex-row-reverse mt-6">
              <Button 
                className="btn-neon bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300"
              >
                Modifier
              </Button>
              <Button 
                variant="outline" 
                className="mt-3 sm:mt-0 sm:mr-3"
                onClick={onClose}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
