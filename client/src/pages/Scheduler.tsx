
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
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
import axios from 'axios';

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

export default function Scheduler() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    status: string;
    scheduled_exams: number;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les données
  const { data: exams = [] } = useQuery<Exam[]>({
    queryKey: ['/api/exams'],
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const { data: proctors = [] } = useQuery<Proctor[]>({
    queryKey: ['/api/proctors'],
  });

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

  const handleStartOptimization = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate();
  };

  // Statistiques pour le tableau de bord
  const unassignedExams = exams.filter(exam => exam.roomId === null).length;
  const assignedExams = exams.length - unassignedExams;
  const assignmentRate = exams.length > 0 ? Math.round((assignedExams / exams.length) * 100) : 0;

  // Vérification des ressources
  const hasEnoughRooms = rooms.length >= unassignedExams;
  const hasEnoughProctors = proctors.length >= unassignedExams;
  const hasAssignedRooms = exams.some(exam => exam.roomId !== null);
  const hasAssignedProctors = exams.some(exam => exam.proctorIds !== null && exam.proctorIds.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Planificateur d'Examens</h1>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              disabled={isOptimizing || exams.length === 0 || unassignedExams === 0}
              className="bg-primary-600 hover:bg-primary-700"
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
              <AlertDialogTitle>Lancer la planification</AlertDialogTitle>
              <AlertDialogDescription>
                Vous êtes sur le point de lancer la planification automatique des examens.
                Cette action va affecter des salles et des surveillants aux examens non-assignés.
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
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full sm:w-[600px] grid-cols-3">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="results">Résultats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Examens</CardTitle>
                <CardDescription>
                  Aperçu des examens à planifier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total des examens</span>
                    <span className="font-semibold">{exams.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Examens assignés</span>
                    <span className="font-semibold text-green-600">{assignedExams}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Examens non assignés</span>
                    <span className="font-semibold text-red-600">{unassignedExams}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Taux d'assignation</span>
                    <span className="font-semibold">{assignmentRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Ressources</CardTitle>
                <CardDescription>
                  Salles et surveillants disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Salles disponibles</span>
                    <span className="font-semibold">{rooms.filter(r => r.status !== 'occupied').length} / {rooms.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Surveillants disponibles</span>
                    <span className="font-semibold">{proctors.length}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className={`w-4 h-4 rounded-full mr-2 ${hasEnoughRooms ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">{hasEnoughRooms ? 'Salles suffisantes' : 'Salles insuffisantes'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${hasEnoughProctors ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">{hasEnoughProctors ? 'Surveillants suffisants' : 'Surveillants insuffisants'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Statut</CardTitle>
                <CardDescription>
                  État de la planification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${hasAssignedRooms ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Salles assignées</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${hasAssignedProctors ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Surveillants assignés</span>
                  </div>
                </div>
                
                {optimizationResult && (
                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <LucideCheck className="text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-700">Optimisation réussie</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      {optimizationResult.scheduled_exams} examens planifiés
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="configuration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de planification</CardTitle>
                <CardDescription>
                  Ajustez les paramètres pour optimiser la planification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LucideCalendar className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Plage horaire maximale</span>
                    </div>
                    <span className="font-medium">8h - 18h</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LucideTimer className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Pause entre examens</span>
                    </div>
                    <span className="font-medium">30 minutes</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LucideUsers className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Surveillants par examen</span>
                    </div>
                    <span className="font-medium">Min. 1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LucideBuildingSquare className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Utilisation des salles</span>
                    </div>
                    <span className="font-medium">Optimale</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="outline" className="w-full">
                  <LucideSettings className="w-4 h-4 mr-2" />
                  Personnaliser
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contraintes</CardTitle>
                <CardDescription>
                  Règles appliquées lors de la planification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <LucideCheck className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Pas d'examens simultanés pour une même promotion</span>
                  </div>
                  
                  <div className="flex items-start">
                    <LucideCheck className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Un surveillant ne peut pas surveiller deux examens en même temps</span>
                  </div>
                  
                  <div className="flex items-start">
                    <LucideCheck className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Capacité des salles respectée selon le nombre de participants</span>
                  </div>
                  
                  <div className="flex items-start">
                    <LucideCheck className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Les examens d'une même filière ne peuvent pas être en même temps</span>
                  </div>
                  
                  <div className="flex items-start">
                    <LucideCheck className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Respect des disponibilités des surveillants</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Résultats de la planification</CardTitle>
              <CardDescription>
                Visualisez les examens planifiés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exams.length > 0 && exams.some(e => e.roomId) ? (
                <div className="space-y-6">
                  {exams.filter(e => e.roomId).map(exam => {
                    const room = rooms.find(r => r.id === exam.roomId);
                    const examProctors = exam.proctorIds 
                      ? proctors.filter(p => exam.proctorIds?.includes(p.id))
                      : [];
                    
                    return (
                      <div key={exam.id} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <LucideBookOpen className="text-primary-600 mr-2" />
                            <h3 className="font-medium">{exam.name}</h3>
                          </div>
                          <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
                            {exam.level.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Salle</p>
                            <p className="font-medium">{room?.name || "Non assignée"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">
                              {new Date(exam.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Durée</p>
                            <p className="font-medium">{exam.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Participants</p>
                            <p className="font-medium">{exam.participants}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Surveillants</p>
                            <p className="font-medium">
                              {examProctors.length > 0 
                                ? examProctors.map(p => p.name).join(", ") 
                                : "Non assignés"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <LucideCalendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">Aucun examen planifié</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Lancez l'optimisation pour planifier les examens
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
