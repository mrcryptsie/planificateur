import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Exam, Room, Proctor } from "@shared/schema";
import { 
  LucideCalendar, 
  LucideSettings,
  LucidePlay,
  LucideLoader,
  LucideCheck,
  LucideX,
  LucideAlertTriangle,
  LucideHome,
  LucideUsers,
  LucideDownload
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function Scheduler() {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<"success" | "error" | "warning" | null>(null);
  
  // Récupérer les examens, salles et surveillants
  const { data: exams = [] } = useQuery<Exam[]>({
    queryKey: ["/api/exams"],
  });
  
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });
  
  const { data: proctors = [] } = useQuery<Proctor[]>({
    queryKey: ["/api/proctors"],
  });
  
  // Fonction pour lancer l'optimisation
  const handleStartOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setOptimizationResult(null);
    
    try {
      // Préparation des données pour l'API
      const optimizationData = {
        exams: exams.map(exam => exam.id),
        rooms: rooms.map(room => room.id),
        proctors: proctors.map(proctor => proctor.id),
        constraints: {
          avoidSameTimeForSameLevel: true,
          avoidSameTimeForSameDepartment: true,
          minimizeProctorCount: true,
          ensureRoomCapacity: true
        }
      };
      
      // Simulation de la progression
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          // Ne pas dépasser 95% pendant la simulation
          return Math.min(prev + Math.random() * 5, 95);
        });
      }, 300);
      
      // Appel à l'API pour lancer l'optimisation
      // Nous simulons cet appel pour le moment
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      setOptimizationProgress(100);
      
      // Déterminer le résultat en fonction des ressources
      let result: "success" | "error" | "warning";
      
      if (!hasEnoughRooms || !hasEnoughProctors) {
        result = "warning";
      } else if (exams.length === 0) {
        result = "error";
      } else {
        result = "success";
      }
      
      setOptimizationResult(result);
    } catch (error) {
      console.error("Erreur lors de l'optimisation:", error);
      setOptimizationResult("error");
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Vérification des ressources
  const hasEnoughRooms = rooms.length >= exams.length;
  const hasEnoughProctors = proctors.length >= exams.length;
  const hasAssignedRooms = exams.some(exam => exam.roomId !== null);
  const hasAssignedProctors = exams.some(exam => exam.proctorIds !== null && exam.proctorIds.length > 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Planificateur d'Examens</h1>
        <Button 
          disabled={isOptimizing || exams.length === 0}
          className="bg-primary-600 hover:bg-primary-700"
          onClick={handleStartOptimization}
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
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full sm:w-[600px] grid-cols-3">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="results">Résultats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Examens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{exams.length}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {hasAssignedRooms 
                    ? `${exams.filter(e => e.roomId !== null).length} avec salle assignée` 
                    : "Aucun examen avec salle assignée"}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <LucideCalendar className="h-5 w-5 text-primary-500" />
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Salles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{rooms.length}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {hasEnoughRooms 
                    ? "Suffisant pour tous les examens" 
                    : `Manque ${exams.length - rooms.length} salles`}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <LucideHome className="h-5 w-5 text-primary-500" />
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Surveillants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{proctors.length}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {hasEnoughProctors 
                    ? "Suffisant pour tous les examens" 
                    : `Manque ${exams.length - proctors.length} surveillants`}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <LucideUsers className="h-5 w-5 text-primary-500" />
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>État du planificateur</CardTitle>
              <CardDescription>Préparation et vérification des ressources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {exams.length === 0 ? (
                <Alert variant="destructive">
                  <LucideAlertTriangle className="h-4 w-4" />
                  <AlertTitle>Aucun examen</AlertTitle>
                  <AlertDescription>
                    Vous devez ajouter des examens avant de pouvoir lancer l'optimisation.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Salles disponibles</span>
                      <span>{hasEnoughRooms ? 
                        <Badge variant="outline" className="bg-green-50 text-green-700">Suffisant</Badge> : 
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">Insuffisant</Badge>}
                      </span>
                    </div>
                    <Progress value={hasEnoughRooms ? 100 : (rooms.length / exams.length) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Surveillants disponibles</span>
                      <span>{hasEnoughProctors ? 
                        <Badge variant="outline" className="bg-green-50 text-green-700">Suffisant</Badge> : 
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">Insuffisant</Badge>}
                      </span>
                    </div>
                    <Progress value={hasEnoughProctors ? 100 : (proctors.length / exams.length) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Contraintes temporelles</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </>
              )}
              
              {optimizationResult && (
                <div className="mt-6">
                  <Separator className="my-4" />
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Dernier résultat</h3>
                    
                    {optimizationResult === "success" && (
                      <Alert className="bg-green-50 border-green-200">
                        <LucideCheck className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-700">Optimisation réussie</AlertTitle>
                        <AlertDescription className="text-green-600">
                          Tous les examens ont été planifiés avec succès. Vous pouvez consulter les résultats dans l'onglet "Résultats".
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {optimizationResult === "warning" && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <LucideAlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-700">Optimisation partielle</AlertTitle>
                        <AlertDescription className="text-amber-600">
                          Certains examens n'ont pas pu être planifiés en raison de contraintes conflictuelles. Veuillez consulter les résultats et résoudre les conflits.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {optimizationResult === "error" && (
                      <Alert variant="destructive">
                        <LucideX className="h-4 w-4" />
                        <AlertTitle>Optimisation échouée</AlertTitle>
                        <AlertDescription>
                          L'optimisation a échoué en raison de contraintes incompatibles. Veuillez ajuster les paramètres et réessayer.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'optimisation</CardTitle>
              <CardDescription>
                Configurez les paramètres de l'algorithme d'optimisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LucideSettings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Paramètres avancés</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Cette fonctionnalité sera disponible prochainement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Résultats de l'optimisation</CardTitle>
              <CardDescription>
                {isOptimizing 
                  ? "Optimisation en cours..." 
                  : optimizationResult 
                    ? "Résultats de la dernière optimisation" 
                    : "Lancez une optimisation pour voir les résultats"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOptimizing ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{Math.round(optimizationProgress)}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-2" />
                  <div className="flex justify-center py-8">
                    <div className="text-center">
                      <LucideLoader className="mx-auto h-12 w-12 text-primary-500 animate-spin" />
                      <h3 className="mt-4 text-lg font-medium">Optimisation en cours</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Veuillez patienter pendant que l'algorithme trouve la meilleure solution...
                      </p>
                    </div>
                  </div>
                </div>
              ) : optimizationResult ? (
                <div className="space-y-4">
                  {optimizationResult === "success" && (
                    <div className="space-y-6">
                      <Alert className="bg-green-50 border-green-200">
                        <LucideCheck className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-700">Planification complète</AlertTitle>
                        <AlertDescription className="text-green-600">
                          Tous les examens ont été planifiés avec succès.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex justify-center py-4">
                        <Button className="mr-2">
                          <LucideCalendar className="mr-2 h-4 w-4" />
                          Voir le calendrier
                        </Button>
                        <Button variant="outline">
                          <LucideDownload className="mr-2 h-4 w-4" />
                          Exporter
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {optimizationResult === "warning" && (
                    <div className="space-y-6">
                      <Alert className="bg-amber-50 border-amber-200">
                        <LucideAlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-700">Planification partielle</AlertTitle>
                        <AlertDescription className="text-amber-600">
                          Certains examens n'ont pas pu être planifiés en raison de contraintes conflictuelles.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex justify-center py-4">
                        <Button className="mr-2" variant="outline" onClick={() => {
                          toast({
                            title: "Résolution de conflits",
                            description: "Cette fonctionnalité sera disponible prochainement.",
                          });
                        }}>
                          <LucideAlertTriangle className="mr-2 h-4 w-4" />
                          Résoudre les conflits
                        </Button>
                        <Button variant="outline">
                          <LucideDownload className="mr-2 h-4 w-4" />
                          Exporter les résultats partiels
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {optimizationResult === "error" && (
                    <div className="space-y-6">
                      <Alert variant="destructive">
                        <LucideX className="h-4 w-4" />
                        <AlertTitle>Planification impossible</AlertTitle>
                        <AlertDescription>
                          L'optimisation a échoué en raison de contraintes incompatibles. Veuillez ajuster les paramètres et réessayer.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex justify-center py-4">
                        <Button 
                          className="mr-2" 
                          variant="outline" 
                          onClick={() => {
                            toast({
                              title: "Aide à la résolution",
                              description: "Cette fonctionnalité sera disponible prochainement.",
                            });
                          }}
                        >
                          <LucideAlertTriangle className="mr-2 h-4 w-4" />
                          Voir les problèmes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <LucidePlay className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Aucun résultat disponible</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Lancez une optimisation pour voir les résultats.
                    </p>
                    <Button className="mt-4" onClick={handleStartOptimization} disabled={isOptimizing || exams.length === 0}>
                      Lancer l'optimisation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}