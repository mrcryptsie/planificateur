import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Exam, Room, Proctor } from "@shared/schema";
import { useLocation } from "wouter";
import { 
  LucideSearch, 
  LucideTrash, 
  LucideEdit, 
  LucidePlus,
  LucideInfo,
  LucideCalendar,
  LucideHome,
  LucideUsers
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ExamManagement() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  
  // Récupérer les examens, salles et surveillants
  const { data: exams = [], isLoading: isLoadingExams } = useQuery<Exam[]>({
    queryKey: ["/api/exams"],
  });
  
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });
  
  const { data: proctors = [] } = useQuery<Proctor[]>({
    queryKey: ["/api/proctors"],
  });
  
  // Filtrer les examens
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = searchTerm === "" || 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === "" || exam.level === levelFilter;
    
    const matchesDepartment = departmentFilter === "" || 
      exam.department === departmentFilter;
    
    return matchesSearch && matchesLevel && matchesDepartment;
  });
  
  // Ajouter un nouvel examen - redirection vers la page d'ajout
  const handleAddExam = () => {
    navigate('/exams/add');
  };
  
  // Traductions pour les niveaux et départements
  const levelLabels: { [key: string]: string } = {
    l1: "L1",
    l2: "L2",
    l3: "L3",
    m1: "M1",
    m2: "M2"
  };
  
  const departmentLabels: { [key: string]: string } = {
    informatique: "Informatique",
    mathematiques: "Mathématiques",
    physique: "Physique",
    chimie: "Chimie",
    biologie: "Biologie",
    autres: "Autres"
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
  
  // Obtenir les détails d'une salle
  const getRoomDetails = (roomId: number | null) => {
    if (!roomId) return null;
    return rooms.find(room => room.id === roomId) || null;
  };
  
  // Obtenir les détails des surveillants
  const getProctorDetails = (proctorIds: number[] | null) => {
    if (!proctorIds || proctorIds.length === 0) return [];
    return proctors.filter(proctor => proctorIds.includes(proctor.id));
  };
  
  // Couleur du badge en fonction du département
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'informatique':
        return 'bg-blue-50 text-blue-700';
      case 'mathematiques':
        return 'bg-purple-50 text-purple-700';
      case 'physique':
        return 'bg-green-50 text-green-700';
      case 'chimie':
        return 'bg-red-50 text-red-700';
      case 'biologie':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };
  
  if (isLoadingExams) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chargement des examens...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestion des Examens</h1>
        <Button 
          className="bg-primary-600 hover:bg-primary-700"
          onClick={handleAddExam}
        >
          <LucidePlus className="mr-2 h-4 w-4" />
          Ajouter un examen
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Tous les examens</CardTitle>
              <CardDescription>
                Gérez les examens planifiés
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="relative flex-grow">
                  <LucideSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher un examen..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      {Object.entries(levelLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      {Object.entries(departmentLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Examen</TableHead>
                      <TableHead>Date et durée</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Salle</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.length > 0 ? (
                      filteredExams.map((exam) => {
                        const room = getRoomDetails(exam.roomId);
                        
                        return (
                          <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{formatDate(exam.date)}</span>
                                <span className="text-xs text-gray-500">{exam.duration}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {levelLabels[exam.level]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getDepartmentColor(exam.department)}
                              >
                                {departmentLabels[exam.department]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {room ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  <LucideHome className="h-3 w-3 mr-1" />
                                  {room.name}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                  Non assignée
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{exam.participants || "N/A"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8 text-blue-600"
                                    >
                                      <LucideInfo className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{exam.name}</DialogTitle>
                                      <DialogDescription>
                                        Détails de l'examen
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Nom</Label>
                                        <div className="col-span-3">{exam.name}</div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Date et heure</Label>
                                        <div className="col-span-3">{formatDate(exam.date)}</div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Durée</Label>
                                        <div className="col-span-3">{exam.duration}</div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Niveau</Label>
                                        <div className="col-span-3">
                                          <Badge variant="outline">
                                            {levelLabels[exam.level]}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Département</Label>
                                        <div className="col-span-3">
                                          <Badge 
                                            variant="outline" 
                                            className={getDepartmentColor(exam.department)}
                                          >
                                            {departmentLabels[exam.department]}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Participants</Label>
                                        <div className="col-span-3">{exam.participants || "Non spécifié"}</div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Salle</Label>
                                        <div className="col-span-3">
                                          {room ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                              <LucideHome className="h-3 w-3 mr-1" />
                                              {room.name} ({room.capacity} places)
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                              Non assignée
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Surveillants</Label>
                                        <div className="col-span-3">
                                          {exam.proctorIds && exam.proctorIds.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                              {getProctorDetails(exam.proctorIds).map(proctor => (
                                                <Badge key={proctor.id} variant="outline" className="bg-blue-50 text-blue-700">
                                                  <LucideUsers className="h-3 w-3 mr-1" />
                                                  {proctor.name}
                                                </Badge>
                                              ))}
                                            </div>
                                          ) : (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                              Non assignés
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-blue-600"
                                  onClick={() => {
                                    toast({
                                      title: "Édition bientôt disponible",
                                      description: "Cette fonctionnalité est en cours de développement.",
                                    });
                                  }}
                                >
                                  <LucideEdit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => {
                                    toast({
                                      title: "Suppression bientôt disponible",
                                      description: "Cette fonctionnalité est en cours de développement.",
                                    });
                                  }}
                                >
                                  <LucideTrash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                          {searchTerm || levelFilter || departmentFilter ? (
                            <div className="flex flex-col items-center">
                              <LucideSearch className="h-10 w-10 mb-2 text-gray-400" />
                              <p>Aucun examen ne correspond à vos critères.</p>
                              <Button 
                                variant="link" 
                                onClick={() => {
                                  setSearchTerm("");
                                  setLevelFilter("");
                                  setDepartmentFilter("");
                                }}
                              >
                                Réinitialiser les filtres
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <LucideCalendar className="h-10 w-10 mb-2 text-gray-400" />
                              <p>Aucun examen n'a été créé.</p>
                              <Button 
                                variant="link" 
                                onClick={handleAddExam}
                              >
                                Ajouter votre premier examen
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des examens</CardTitle>
              <CardDescription>
                Visualisez les examens par date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <LucideCalendar className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">Vue Calendrier</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Cette fonctionnalité sera disponible prochainement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}