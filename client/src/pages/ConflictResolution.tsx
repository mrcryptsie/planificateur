import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Exam, Room, Proctor } from "@shared/schema";
import { 
  LucideAlertTriangle,
  LucideCalendar,
  LucideCheck,
  LucideEdit,
  LucideArrowRight,
  LucideRefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type pour les conflits simulés
interface Conflict {
  id: number;
  type: 'room' | 'proctor' | 'time';
  description: string;
  examId1: number;
  examId2: number;
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
}

export default function ConflictResolution() {
  const { toast } = useToast();
  const [conflictTypeFilter, setConflictTypeFilter] = useState<string>("all");
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  
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
  
  // Exemple de conflits simulés
  const conflicts: Conflict[] = [
    {
      id: 1,
      type: 'room',
      description: 'Même salle assignée à deux examens au même moment',
      examId1: exams[0]?.id || 1,
      examId2: exams[1]?.id || 2,
      severity: 'high',
      suggestion: 'Assigner une salle différente pour l\'un des examens'
    },
    {
      id: 2,
      type: 'proctor',
      description: 'Un surveillant est assigné à deux examens simultanés',
      examId1: exams[0]?.id || 1,
      examId2: exams[2]?.id || 3,
      severity: 'medium',
      suggestion: 'Assigner un autre surveillant pour l\'un des examens'
    },
    {
      id: 3,
      type: 'time',
      description: 'Chevauchement de temps pour deux examens du même département',
      examId1: exams[1]?.id || 2,
      examId2: exams[2]?.id || 3,
      severity: 'low',
      suggestion: 'Modifier l\'horaire de l\'un des examens'
    }
  ];
  
  // Filtrer les conflits
  const filteredConflicts = conflicts.filter(conflict => 
    conflictTypeFilter === 'all' || conflict.type === conflictTypeFilter
  );
  
  // Obtenir les détails d'un examen
  const getExamById = (id: number) => {
    return exams.find(exam => exam.id === id) || null;
  };
  
  // Formater la date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Traduction des types de conflit
  const conflictTypeLabels: Record<string, string> = {
    'room': 'Salle',
    'proctor': 'Surveillant',
    'time': 'Horaire',
    'all': 'Tous les types'
  };
  
  // Couleur du badge en fonction de la sévérité
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-amber-50 text-amber-700';
      case 'low':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };
  
  // Texte de la sévérité
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Élevée';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Faible';
      default:
        return 'Inconnue';
    }
  };
  
  // Appliquer la suggestion
  const handleApplySuggestion = (conflictId: number) => {
    toast({
      title: "Application de la suggestion",
      description: "Cette fonctionnalité sera disponible prochainement.",
    });
  };
  
  // Résoudre manuellement
  const handleManualResolution = (conflictId: number) => {
    toast({
      title: "Résolution manuelle",
      description: "Cette fonctionnalité sera disponible prochainement.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Résolution des Conflits</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            toast({
              title: "Recherche de conflits",
              description: "Aucun nouveau conflit détecté.",
            });
          }}
        >
          <LucideRefreshCw className="mr-2 h-4 w-4" />
          Vérifier les conflits
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Conflits détectés</CardTitle>
              <Select value={conflictTypeFilter} onValueChange={setConflictTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type de conflit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="room">Salles</SelectItem>
                  <SelectItem value="proctor">Surveillants</SelectItem>
                  <SelectItem value="time">Horaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {filteredConflicts.length} conflit{filteredConflicts.length !== 1 ? 's' : ''} détecté{filteredConflicts.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredConflicts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sévérité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConflicts.map((conflict) => (
                    <TableRow 
                      key={conflict.id} 
                      className={selectedConflict?.id === conflict.id ? "bg-primary-50" : ""}
                    >
                      <TableCell>
                        <Badge variant="outline">
                          {conflictTypeLabels[conflict.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>{conflict.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getSeverityColor(conflict.severity)}
                        >
                          {getSeverityText(conflict.severity)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedConflict(conflict)}
                        >
                          <LucideArrowRight className="h-4 w-4" />
                          <span className="sr-only">Voir les détails</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <LucideCheck className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Aucun conflit détecté</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {conflictTypeFilter !== 'all' 
                    ? `Aucun conflit de type "${conflictTypeLabels[conflictTypeFilter]}" n'a été trouvé.` 
                    : "Aucun conflit n'a été détecté dans votre planification."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Détails du conflit</CardTitle>
            <CardDescription>
              {selectedConflict 
                ? "Informations et suggestions de résolution" 
                : "Sélectionnez un conflit pour voir les détails"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedConflict ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={getSeverityColor(selectedConflict.severity)}
                  >
                    Sévérité: {getSeverityText(selectedConflict.severity)}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                  <p>{conflictTypeLabels[selectedConflict.type]}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p>{selectedConflict.description}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Examens concernés</h3>
                  
                  <div className="space-y-3">
                    {[selectedConflict.examId1, selectedConflict.examId2].map((examId, index) => {
                      const exam = getExamById(examId);
                      return exam ? (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <p className="font-medium">{exam.name}</p>
                          <p className="text-sm text-gray-500">
                            <LucideCalendar className="inline-block h-3.5 w-3.5 mr-1 relative -top-[1px]" />
                            {formatDate(exam.date)}
                          </p>
                          <p className="text-sm text-gray-500">Durée: {exam.duration}</p>
                        </div>
                      ) : (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <p className="italic text-gray-500">Examen non trouvé (ID: {examId})</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Suggestion</h3>
                  <Alert className="bg-blue-50 border-blue-200 mt-2">
                    <LucideAlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      {selectedConflict.suggestion}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <LucideAlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">Aucun conflit sélectionné</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Sélectionnez un conflit dans la liste pour voir les détails et les suggestions de résolution.
                </p>
              </div>
            )}
          </CardContent>
          {selectedConflict && (
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full"
                onClick={() => handleApplySuggestion(selectedConflict.id)}
              >
                <LucideCheck className="mr-2 h-4 w-4" />
                Appliquer la suggestion
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleManualResolution(selectedConflict.id)}
              >
                <LucideEdit className="mr-2 h-4 w-4" />
                Résoudre manuellement
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}