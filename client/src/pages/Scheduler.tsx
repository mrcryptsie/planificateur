
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  LucidePlay,
  LucideLoader,
  LucideCheck,
  LucideAlertCircle,
  LucideCalendar,
  LucideUsers,
  LucideBuildingSquare,
  LucideTimer,
  LucideSettings,
  LucideBookOpen,
  LucideSearch,
  LucideFilter,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface Room {
  id: number;
  name: string;
  capacity: number;
  status: string;
}

interface Proctor {
  id: number;
  name: string;
  department: string;
}

interface Exam {
  id: number;
  name: string;
  level: string;
  department: string;
  duration: string;
  date: string;
  roomId: number | null;
  participants: number;
  proctorIds: number[] | null;
}

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  day: string;
}

interface FilterOptions {
  department: string;
  level: string;
  date: string;
}

export default function Scheduler() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    status: string;
    scheduled_exams: number;
  } | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    department: '',
    level: '',
    date: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Récupérer les données
  const { data: exams = [], isLoading: examsLoading } = useQuery<Exam[]>({
    queryKey: ['/api/exams'],
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const { data: proctors = [] } = useQuery<Proctor[]>({
    queryKey: ['/api/proctors'],
  });

  const { data: timeSlots = [] } = useQuery<TimeSlot[]>({
    queryKey: ['/api/time-slots'],
  });

  // État pour le formulaire
  const [formData, setFormData] = useState({
    examId: '',
    roomId: '',
    timeSlotId: '',
    proctorIds: [] as string[],
  });

  // Vérifier s'il y a assez de salles et de surveillants
  const unscheduledExams = exams.filter(exam => !exam.roomId);
  const availableRooms = rooms.filter(room => room.status !== 'occupied');
  const hasEnoughRooms = availableRooms.length >= unscheduledExams.length;
  const hasEnoughProctors = proctors.length >= unscheduledExams.length;

  // Mutation pour l'optimisation
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/schedule');
      return response.data;
    },
    onSuccess: (data) => {
      setOptimizationResult(data);
      toast({
        title: "Planification terminée",
        description: `${data.scheduled_exams} examens ont été planifiés avec succès.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "La planification a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsOptimizing(false);
    }
  });

  // Mutation pour la planification manuelle
  const manualScheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/manual-schedule', data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Examen planifié",
        description: "L'examen a été planifié avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
      // Réinitialiser le formulaire
      setFormData({
        examId: '',
        roomId: '',
        timeSlotId: '',
        proctorIds: [],
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "La planification de l'examen a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  const handleStartOptimization = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate();
  };

  const handleManualScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    manualScheduleMutation.mutate(formData);
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredExams = exams.filter(exam => {
    return (
      (filters.department === '' || exam.department === filters.department) &&
      (filters.level === '' || exam.level === filters.level) &&
      (filters.date === '' || exam.date.includes(filters.date))
    );
  });

  const scheduledExams = filteredExams.filter(exam => exam.roomId !== null);
  const unassignedExams = filteredExams.filter(exam => exam.roomId === null);

  // Options pour les filtres
  const departments = [...new Set(exams.map(e => e.department))];
  const levels = [...new Set(exams.map(e => e.level))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Planificateur d'examens</h1>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="automatic">Automatique</TabsTrigger>
          <TabsTrigger value="manual">Manuel</TabsTrigger>
        </TabsList>
        
        {/* Onglet de tableau de bord */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total des examens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{exams.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {scheduledExams.length} planifiés, {unassignedExams.length} non planifiés
                </p>
                <Progress
                  value={exams.length > 0 ? (scheduledExams.length / exams.length) * 100 : 0}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Salles disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableRooms.length} / {rooms.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {rooms.length - availableRooms.length} salles occupées
                </p>
                <Progress
                  value={rooms.length > 0 ? (availableRooms.length / rooms.length) * 100 : 0}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Surveillants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{proctors.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {proctors.length > 0 ? 'Disponibles pour les examens' : 'Aucun surveillant'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Créneaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{timeSlots.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Créneaux disponibles pour planification
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Liste des examens avec filtres */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Liste des examens</CardTitle>
              <CardDescription>Recherchez et filtrez les examens</CardDescription>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les départements</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les niveaux</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 gap-3 p-4 font-medium bg-muted/50">
                    <div>Examen</div>
                    <div>Niveau</div>
                    <div>Département</div>
                    <div>Durée</div>
                    <div>Date</div>
                    <div>Salle</div>
                    <div>Statut</div>
                  </div>
                  {filteredExams.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucun examen trouvé avec ces filtres
                    </div>
                  ) : (
                    filteredExams.map((exam) => (
                      <div key={exam.id} className="grid grid-cols-7 gap-3 p-4 border-t">
                        <div>{exam.name}</div>
                        <div>{exam.level}</div>
                        <div>{exam.department}</div>
                        <div>{exam.duration}</div>
                        <div>{new Date(exam.date).toLocaleDateString()}</div>
                        <div>
                          {exam.roomId ? (
                            rooms.find(r => r.id === exam.roomId)?.name || '-'
                          ) : (
                            <span className="text-muted-foreground">Non assigné</span>
                          )}
                        </div>
                        <div>
                          {exam.roomId ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Planifié
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Non planifié
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet de planification automatique */}
        <TabsContent value="automatic">
          <Card>
            <CardHeader>
              <CardTitle>Planification automatique</CardTitle>
              <CardDescription>
                Utilisez notre algorithme d'optimisation pour planifier automatiquement tous les examens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <LucideCalendar className="text-primary h-8 w-8 mb-2" />
                    <div className="text-xl font-semibold">{unscheduledExams.length}</div>
                    <div className="text-muted-foreground text-sm">Examens non planifiés</div>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <LucideBuildingSquare className="text-primary h-8 w-8 mb-2" />
                    <div className="text-xl font-semibold">{availableRooms.length}</div>
                    <div className="text-muted-foreground text-sm">Salles disponibles</div>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <LucideUsers className="text-primary h-8 w-8 mb-2" />
                    <div className="text-xl font-semibold">{proctors.length}</div>
                    <div className="text-muted-foreground text-sm">Surveillants disponibles</div>
                  </div>
                </div>
                
                {/* Résultat de la dernière optimisation */}
                {optimizationResult && (
                  <Alert className={optimizationResult.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
                    <LucideCheck className="h-4 w-4 text-green-600" />
                    <AlertTitle>Résultat de la planification</AlertTitle>
                    <AlertDescription>
                      {optimizationResult.status === 'success'
                        ? `${optimizationResult.scheduled_exams} examens ont été planifiés avec succès.`
                        : 'La planification n\'a pas pu être complétée.'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isOptimizing || unscheduledExams.length === 0}
                  >
                    {isOptimizing ? (
                      <>
                        <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                        Optimisation en cours...
                      </>
                    ) : (
                      <>
                        <LucidePlay className="mr-2 h-4 w-4" />
                        Lancer l'optimisation
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la planification automatique</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous êtes sur le point de lancer la planification automatique pour {unscheduledExams.length} examens.
                      Cette action peut prendre quelques instants.
                      
                      {!hasEnoughRooms && (
                        <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                          <LucideAlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertTitle className="text-yellow-600">Attention</AlertTitle>
                          <AlertDescription className="text-yellow-600">
                            Il n'y a pas assez de salles disponibles pour tous les examens.
                          </AlertDescription>
                        </Alert>
                      )}
                      {!hasEnoughProctors && (
                        <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                          <LucideAlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertTitle className="text-yellow-600">Attention</AlertTitle>
                          <AlertDescription className="text-yellow-600">
                            Il n'y a pas assez de surveillants disponibles pour tous les examens.
                          </AlertDescription>
                        </Alert>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleStartOptimization}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Lancer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Onglet de planification manuelle */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Planification manuelle</CardTitle>
              <CardDescription>
                Assignez manuellement des salles et des surveillants aux examens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualScheduleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Examen</label>
                    <Select
                      value={formData.examId}
                      onValueChange={(value) => setFormData({...formData, examId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un examen" />
                      </SelectTrigger>
                      <SelectContent>
                        {unscheduledExams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id.toString()}>{exam.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                    <Select
                      value={formData.roomId}
                      onValueChange={(value) => setFormData({...formData, roomId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une salle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.name} (Capacité: {room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Créneau horaire</label>
                    <Select
                      value={formData.timeSlotId}
                      onValueChange={(value) => setFormData({...formData, timeSlotId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un créneau" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id.toString()}>
                            {slot.day} - {slot.start_time} à {slot.end_time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surveillants</label>
                    <Select
                      value={formData.proctorIds[0] || ''}
                      onValueChange={(value) => setFormData({...formData, proctorIds: [value]})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un surveillant" />
                      </SelectTrigger>
                      <SelectContent>
                        {proctors.map((proctor) => (
                          <SelectItem key={proctor.id} value={proctor.id.toString()}>
                            {proctor.name} ({proctor.department})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Un seul surveillant peut être sélectionné à la fois.
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!formData.examId || !formData.roomId || !formData.timeSlotId || formData.proctorIds.length === 0}
                >
                  Planifier l'examen
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
