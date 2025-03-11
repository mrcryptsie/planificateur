import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@shared/schema";
import { 
  LucideHome,
  LucideSearch, 
  LucideTrash, 
  LucideEdit, 
  LucidePlus,
  LucideInfo,
  LucideUsers,
  LucideCalendar 
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
import { Progress } from "@/components/ui/progress";

export default function RoomManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    status: "available",
  });
  
  // Récupérer les salles
  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });
  
  // Filtrer les salles
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = searchTerm === "" || 
      room.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || statusFilter === "all" || 
      room.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Ajouter une nouvelle salle (mock)
  const handleAddRoom = () => {
    if (!newRoom.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la salle est requis.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newRoom.capacity || parseInt(newRoom.capacity) <= 0) {
      toast({
        title: "Erreur",
        description: "La capacité doit être un nombre positif.",
        variant: "destructive",
      });
      return;
    }
    
    // Ici, nous devrions appeler l'API pour créer une nouvelle salle
    toast({
      title: "Ajout de salle",
      description: "Cette fonctionnalité sera bientôt disponible. La salle n'a pas été ajoutée.",
    });
    
    setIsAddRoomDialogOpen(false);
    setNewRoom({ name: "", capacity: "", status: "available" });
  };
  
  // Traductions pour les statuts
  const statusLabels: { [key: string]: string } = {
    'available': 'Disponible',
    'partially_occupied': 'Partiellement occupée',
    'occupied': 'Occupée'
  };
  
  // Couleur du badge en fonction du status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-700';
      case 'partially_occupied':
        return 'bg-amber-50 text-amber-700';
      case 'occupied':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chargement des salles...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestion des Salles</h1>
        <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <LucidePlus className="mr-2 h-4 w-4" />
              Ajouter une salle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle salle</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter une nouvelle salle.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  className="col-span-3"
                  placeholder="A101"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacité
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                  className="col-span-3"
                  placeholder="50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Statut
                </Label>
                <Select
                  value={newRoom.status}
                  onValueChange={(value) => setNewRoom({ ...newRoom, status: value })}
                >
                  <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoomDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddRoom}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Toutes les salles</CardTitle>
          <CardDescription>
            Gérez les salles disponibles pour les examens
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="relative flex-grow">
              <LucideSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une salle..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
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
                  <TableHead>Salle</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Taux d'occupation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Examens planifiés</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.capacity} places</TableCell>
                      <TableCell>
                        <div className="w-full flex items-center gap-2">
                          <Progress value={room.occupancyRate || 0} className="h-2" />
                          <span className="text-sm text-gray-500">{room.occupancyRate || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(room.status || 'available')}
                        >
                          {statusLabels[room.status || 'available']}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                            <LucideCalendar className="h-3 w-3 mr-1" />
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
                                <DialogTitle>Salle {room.name}</DialogTitle>
                                <DialogDescription>
                                  Détails de la salle
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Nom</Label>
                                  <div className="col-span-3">{room.name}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Capacité</Label>
                                  <div className="col-span-3">{room.capacity} places</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Statut</Label>
                                  <div className="col-span-3">
                                    <Badge variant="outline" className={getStatusColor(room.status || 'available')}>
                                      {statusLabels[room.status || 'available']}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Taux d'occupation</Label>
                                  <div className="col-span-3">
                                    <div className="w-full flex items-center gap-2">
                                      <Progress value={room.occupancyRate || 0} className="h-2" />
                                      <span className="text-sm">{room.occupancyRate || 0}%</span>
                                    </div>
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
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      {searchTerm || statusFilter ? (
                        <div className="flex flex-col items-center">
                          <LucideSearch className="h-10 w-10 mb-2 text-gray-400" />
                          <p>Aucune salle ne correspond à vos critères.</p>
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("");
                            }}
                          >
                            Réinitialiser les filtres
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <LucideHome className="h-10 w-10 mb-2 text-gray-400" />
                          <p>Aucune salle n'a été créée.</p>
                          <Button 
                            variant="link" 
                            onClick={() => setIsAddRoomDialogOpen(true)}
                          >
                            Ajouter votre première salle
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