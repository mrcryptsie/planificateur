import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Proctor } from "@shared/schema";
import { 
  LucideUser, 
  LucideUsers,
  LucideSearch, 
  LucideTrash, 
  LucideEdit, 
  LucidePlus,
  LucideInfo,
  LucideCalendar,
  LucideHome
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProctorManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isAddProctorDialogOpen, setIsAddProctorDialogOpen] = useState(false);
  const [newProctor, setNewProctor] = useState({
    name: "",
    department: "",
    avatarUrl: "",
  });
  
  // Récupérer les surveillants
  const { data: proctors = [], isLoading } = useQuery<Proctor[]>({
    queryKey: ["/api/proctors"],
  });
  
  // Filtrer les surveillants
  const filteredProctors = proctors.filter((proctor) => {
    const matchesSearch = searchTerm === "" || 
      proctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "" || 
      proctor.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Ajouter un nouveau surveillant (mock)
  const handleAddProctor = () => {
    if (!newProctor.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du surveillant est requis.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newProctor.department) {
      toast({
        title: "Erreur",
        description: "Le département est requis.",
        variant: "destructive",
      });
      return;
    }
    
    // Ici, nous devrions appeler l'API pour créer un nouveau surveillant
    toast({
      title: "Ajout de surveillant",
      description: "Cette fonctionnalité sera bientôt disponible. Le surveillant n'a pas été ajouté.",
    });
    
    setIsAddProctorDialogOpen(false);
    setNewProctor({ name: "", department: "", avatarUrl: "" });
  };
  
  // Traductions pour les départements
  const departmentLabels: { [key: string]: string } = {
    informatique: "Informatique",
    mathematiques: "Mathématiques",
    physique: "Physique",
    chimie: "Chimie",
    biologie: "Biologie",
    autres: "Autres"
  };
  
  // Générer les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Définir la couleur de l'avatar en fonction du département
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "informatique":
        return "bg-blue-500";
      case "mathematiques":
        return "bg-purple-500";
      case "physique":
        return "bg-green-500";
      case "chimie":
        return "bg-red-500";
      case "biologie":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chargement des surveillants...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestion des Surveillants</h1>
        <Dialog open={isAddProctorDialogOpen} onOpenChange={setIsAddProctorDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <LucidePlus className="mr-2 h-4 w-4" />
              Ajouter un surveillant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau surveillant</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter un nouveau surveillant.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={newProctor.name}
                  onChange={(e) => setNewProctor({ ...newProctor, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Département
                </Label>
                <Select
                  value={newProctor.department}
                  onValueChange={(value) => setNewProctor({ ...newProctor, department: value })}
                >
                  <SelectTrigger id="department" className="col-span-3">
                    <SelectValue placeholder="Choisir un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(departmentLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatarUrl" className="text-right">
                  URL Avatar
                </Label>
                <Input
                  id="avatarUrl"
                  value={newProctor.avatarUrl}
                  onChange={(e) => setNewProctor({ ...newProctor, avatarUrl: e.target.value })}
                  className="col-span-3"
                  placeholder="https://exemple.com/avatar.jpg (optionnel)"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProctorDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddProctor}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tous les surveillants</CardTitle>
          <CardDescription>
            Gérez les surveillants disponibles pour les examens
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="relative flex-grow">
              <LucideSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un surveillant..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                {Object.entries(departmentLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Surveillant</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Disponibilité</TableHead>
                  <TableHead>Examens assignés</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProctors.length > 0 ? (
                  filteredProctors.map((proctor) => (
                    <TableRow key={proctor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={proctor.avatarUrl || ""} alt={proctor.name} />
                            <AvatarFallback className={getDepartmentColor(proctor.department)}>
                              {getInitials(proctor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{proctor.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {departmentLabels[proctor.department]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
                          <LucideCalendar className="h-3 w-3 mr-1" />
                          {proctor.availability && proctor.availability.length > 0 
                            ? `${proctor.availability.length} créneaux` 
                            : "Aucun créneau défini"
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                            0 examens
                          </Badge>
                        </div>
                      </TableCell>
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
                                <DialogTitle>{proctor.name}</DialogTitle>
                                <DialogDescription>
                                  Détails du surveillant
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="flex justify-center mb-2">
                                  <Avatar className="h-24 w-24">
                                    <AvatarImage src={proctor.avatarUrl || ""} alt={proctor.name} />
                                    <AvatarFallback className={`text-2xl ${getDepartmentColor(proctor.department)}`}>
                                      {getInitials(proctor.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Nom</Label>
                                  <div className="col-span-3">{proctor.name}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Département</Label>
                                  <div className="col-span-3">
                                    <Badge variant="outline" className="capitalize">
                                      {departmentLabels[proctor.department]}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Disponibilité</Label>
                                  <div className="col-span-3">
                                    {proctor.availability && proctor.availability.length > 0 ? (
                                      <div className="space-y-1">
                                        {proctor.availability.map((slot, index) => (
                                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                                            {slot}
                                          </Badge>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-gray-500">Aucun créneau défini</span>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      {searchTerm || departmentFilter ? (
                        <div className="flex flex-col items-center">
                          <LucideSearch className="h-10 w-10 mb-2 text-gray-400" />
                          <p>Aucun surveillant ne correspond à vos critères.</p>
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setSearchTerm("");
                              setDepartmentFilter("");
                            }}
                          >
                            Réinitialiser les filtres
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <LucideUsers className="h-10 w-10 mb-2 text-gray-400" />
                          <p>Aucun surveillant n'a été créé.</p>
                          <Button 
                            variant="link" 
                            onClick={() => setIsAddProctorDialogOpen(true)}
                          >
                            Ajouter votre premier surveillant
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
    </div>
  );
}