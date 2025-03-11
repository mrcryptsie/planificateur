import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exam, Room, Proctor } from "@shared/schema";
import { useLocation } from "wouter";
import { 
  LucideCalendarPlus, 
  LucideSearch, 
  LucideFilter, 
  LucideTrash, 
  LucideEdit, 
  LucideCheck, 
  LucideX 
} from "lucide-react";
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
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ExamManagement() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  
  // Récupérer les examens
  const { data: exams = [], isLoading: isLoadingExams } = useQuery<Exam[]>({
    queryKey: ["/api/exams"],
  });
  
  // Récupérer les salles pour l'affichage des informations
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  // Récupérer les proctors pour l'affichage des informations
  const { data: proctors = [] } = useQuery<Proctor[]>({
    queryKey: ["/api/proctors"],
  });
  
  // Filtrer les examens
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = searchTerm === "" || 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "" || 
      exam.department === departmentFilter;
    
    const matchesLevel = levelFilter === "" || 
      exam.level === levelFilter;
    
    return matchesSearch && matchesDepartment && matchesLevel;
  });
  
  // Trouver une salle par son ID
  const getRoomById = (roomId: number | null) => {
    if (!roomId) return null;
    return rooms.find(room => room.id === roomId);
  };
  
  // Trouver les surveillants par leurs IDs
  const getProctorsByIds = (proctorIds: number[] | null) => {
    if (!proctorIds || !proctorIds.length) return [];
    return proctors.filter(proctor => proctorIds.includes(proctor.id));
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
  
  // Traductions pour les niveaux et départements
  const levelLabels: { [key: string]: string } = {
    l1: "Licence 1",
    l2: "Licence 2",
    l3: "Licence 3",
    m1: "Master 1",
    m2: "Master 2"
  };
  
  const departmentLabels: { [key: string]: string } = {
    informatique: "Informatique",
    mathematiques: "Mathématiques",
    physique: "Physique",
    chimie: "Chimie",
    biologie: "Biologie",
    autres: "Autres"
  };
  
  const handleAddExam = () => {
    setLocation('/exams/add');
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
          onClick={handleAddExam}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <LucideCalendarPlus className="mr-2 h-4 w-4" />
          Ajouter un examen
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="list">Liste des examens</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tous les examens</CardTitle>
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
                <div className="flex flex-row gap-2">
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
                  
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      {Object.entries(levelLabels).map(([value, label]) => (
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
                      <TableHead>Nom</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Salle</TableHead>
                      <TableHead>Surveillance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.length > 0 ? (
                      filteredExams.map((exam) => {
                        const room = getRoomById(exam.roomId);
                        const examProctors = getProctorsByIds(exam.proctorIds);
                        
                        return (
                          <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.name}</TableCell>
                            <TableCell>{formatDate(exam.date)}</TableCell>
                            <TableCell>{levelLabels[exam.level]}</TableCell>
                            <TableCell>{departmentLabels[exam.department]}</TableCell>
                            <TableCell>{exam.duration}</TableCell>
                            <TableCell>
                              {room ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
                                  {room.name}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                                  Non assignée
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {examProctors.length > 0 ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
                                  {examProctors.length} surveillant(s)
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                                  Non assignée
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
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
                        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                          {searchTerm || departmentFilter || levelFilter ? (
                            <div className="flex flex-col items-center">
                              <LucideFilter className="h-10 w-10 mb-2 text-gray-400" />
                              <p>Aucun examen ne correspond à vos filtres.</p>
                              <Button 
                                variant="link" 
                                onClick={() => {
                                  setSearchTerm("");
                                  setDepartmentFilter("");
                                  setLevelFilter("");
                                }}
                              >
                                Réinitialiser les filtres
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <LucideCalendarPlus className="h-10 w-10 mb-2 text-gray-400" />
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
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des examens</CardTitle>
              <p className="text-sm text-gray-500">
                Vue en format calendrier à venir prochainement.
              </p>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-12">
              <div className="text-center">
                <LucideCalendarPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">Vue calendrier bientôt disponible</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cette fonctionnalité est en cours de développement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}