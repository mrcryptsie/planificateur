import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Exam, Room, Proctor } from "@shared/schema";
import { 
  LucideDownload,
  LucideFilePlus2,
  LucideFileText,
  LucideFileSpreadsheet,
  LucideCalendar,
  LucideSettings
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ExportPlan() {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState("pdf");
  const [includeOptions, setIncludeOptions] = useState({
    exams: true,
    rooms: true,
    proctors: true,
    conflicts: false,
    statistics: true
  });
  
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
  
  // Gérer les changements de cases à cocher
  const handleCheckboxChange = (option: keyof typeof includeOptions) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Fonction d'exportation (simulée)
  const handleExport = () => {
    toast({
      title: `Exportation en ${exportFormat.toUpperCase()}`,
      description: "La fonctionnalité d'exportation sera disponible prochainement.",
    });
  };
  
  // Formater la date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Obtenir l'icône du format d'exportation
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <LucideFileText className="h-4 w-4" />;
      case 'excel':
        return <LucideFileSpreadsheet className="h-4 w-4" />;
      case 'calendar':
        return <LucideCalendar className="h-4 w-4" />;
      default:
        return <LucideFilePlus2 className="h-4 w-4" />;
    }
  };
  
  // Vérifier si le plan est prêt à être exporté
  const isPlanReady = exams.length > 0 && exams.some(exam => exam.roomId !== null);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Exportation du Planning</h1>
        <Button 
          onClick={handleExport}
          disabled={!isPlanReady}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <LucideDownload className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Aperçu du planning</CardTitle>
            <CardDescription>
              {isPlanReady 
                ? `${exams.filter(e => e.roomId !== null).length} examens planifiés sur ${exams.length} au total` 
                : "Aucun examen n'a encore été planifié"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">Vue Calendrier</TabsTrigger>
                <TabsTrigger value="list">Vue Liste</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <LucideCalendar className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">Vue Calendrier</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Cette fonctionnalité sera disponible prochainement.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-4">
                {exams.length > 0 ? (
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Examen</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Salle</TableHead>
                          <TableHead>Surveillants</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exams.map((exam) => {
                          const room = rooms.find(r => r.id === exam.roomId);
                          const examProctors = proctors.filter(p => exam.proctorIds?.includes(p.id));
                          
                          return (
                            <TableRow key={exam.id}>
                              <TableCell className="font-medium">{exam.name}</TableCell>
                              <TableCell>{formatDate(exam.date)}</TableCell>
                              <TableCell>
                                {room ? room.name : <span className="text-gray-400 italic">Non assignée</span>}
                              </TableCell>
                              <TableCell>
                                {examProctors.length > 0 
                                  ? examProctors.map(p => p.name).join(", ") 
                                  : <span className="text-gray-400 italic">Non assignés</span>
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <LucideCalendar className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">Aucun examen</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Aucun examen n'a été créé pour le moment.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Options d'exportation</CardTitle>
            <CardDescription>
              Personnalisez votre exportation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Format</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-20"
                  onClick={() => setExportFormat('pdf')}
                >
                  <LucideFileText className="h-8 w-8 mb-1" />
                  <span className="text-xs">PDF</span>
                </Button>
                <Button
                  variant={exportFormat === 'excel' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-20"
                  onClick={() => setExportFormat('excel')}
                >
                  <LucideFileSpreadsheet className="h-8 w-8 mb-1" />
                  <span className="text-xs">Excel</span>
                </Button>
                <Button
                  variant={exportFormat === 'calendar' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-20"
                  onClick={() => setExportFormat('calendar')}
                >
                  <LucideCalendar className="h-8 w-8 mb-1" />
                  <span className="text-xs">iCal</span>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Contenu</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="exams" 
                    checked={includeOptions.exams}
                    onCheckedChange={() => handleCheckboxChange('exams')}
                  />
                  <Label htmlFor="exams">Liste des examens</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rooms" 
                    checked={includeOptions.rooms}
                    onCheckedChange={() => handleCheckboxChange('rooms')}
                  />
                  <Label htmlFor="rooms">Utilisation des salles</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="proctors" 
                    checked={includeOptions.proctors}
                    onCheckedChange={() => handleCheckboxChange('proctors')}
                  />
                  <Label htmlFor="proctors">Affectation des surveillants</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="conflicts" 
                    checked={includeOptions.conflicts}
                    onCheckedChange={() => handleCheckboxChange('conflicts')}
                  />
                  <Label htmlFor="conflicts">Conflits résiduels</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="statistics" 
                    checked={includeOptions.statistics}
                    onCheckedChange={() => handleCheckboxChange('statistics')}
                  />
                  <Label htmlFor="statistics">Statistiques</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Destinataires</h3>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Choisir les destinataires" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="students">Étudiants</SelectItem>
                  <SelectItem value="teachers">Enseignants</SelectItem>
                  <SelectItem value="proctors">Surveillants</SelectItem>
                  <SelectItem value="staff">Personnel administratif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleExport}
              disabled={!isPlanReady}
            >
              {getFormatIcon(exportFormat)}
              <span className="ml-2">
                Exporter en {exportFormat === 'pdf' ? 'PDF' : exportFormat === 'excel' ? 'Excel' : 'iCalendar'}
              </span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}