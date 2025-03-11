import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  LucideCalendar,
  LucideSettings,
  LucideUser,
  LucideHome,
  LucideClock,
} from "lucide-react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { createTimeSlots } from "../utils/timeSlots";
import { useToast } from "@/hooks/use-toast";
import { LucideAlertCircle, LucideCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";


export default function Scheduler() {
  const { toast } = useToast();
  const [schedulingInProgress, setSchedulingInProgress] = useState(false);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedProctors, setSelectedProctors] = useState<string[]>([]);
  const [isGeneratingTimeSlots, setIsGeneratingTimeSlots] = useState(false);

  const queryClient = useQueryClient();

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await fetch("/api/exams");
      if (!res.ok) throw new Error("Failed to fetch exams");
      return res.json();
    }
  });

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await fetch("/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return res.json();
    }
  });

  const { data: timeSlots, isLoading: isLoadingTimeSlots } = useQuery({
    queryKey: ["time-slots"],
    queryFn: async () => {
      const res = await fetch("/api/time-slots");
      if (!res.ok) throw new Error("Failed to fetch time slots");
      return res.json();
    }
  });

  const { data: proctors, isLoading: isLoadingProctors } = useQuery({
    queryKey: ["proctors"],
    queryFn: async () => {
      const res = await fetch("/api/proctors");
      if (!res.ok) throw new Error("Failed to fetch proctors");
      return res.json();
    }
  });

  const handleAutomaticScheduling = async () => {
    try {
      setSchedulingInProgress(true);
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        toast({
          title: "Planification réussie",
          description: `${result.scheduled_exams} examens planifiés avec succès.`,
        });
      } else {
        toast({
          title: "Échec de la planification",
          description: "Impossible de trouver une solution. Veuillez essayer manuellement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la planification automatique:", error);
      toast({
        title: "Erreur de planification",
        description: "Une erreur s'est produite lors de la planification automatique.",
        variant: "destructive",
      });
    } finally {
      setSchedulingInProgress(false);
    }
  };

  const handleManualScheduling = async () => {
    if (!selectedExam || !selectedRoom || !selectedTimeSlot || selectedProctors.length === 0) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      setSchedulingInProgress(true);

      const response = await axios.post("/api/manual-schedule", {
        examId: parseInt(selectedExam),
        roomId: parseInt(selectedRoom),
        timeSlotId: parseInt(selectedTimeSlot),
        proctorIds: selectedProctors.map(id => parseInt(id))
      });

      if (response.data.status === 'success') {
        toast.success("Planification manuelle réussie");
        // Rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ["exams"] });
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        queryClient.invalidateQueries({ queryKey: ["time-slots"] });

        // Réinitialiser les sélections
        setSelectedExam("");
        setSelectedRoom("");
        setSelectedTimeSlot("");
        setSelectedProctors([]);
      } else {
        toast.error("Erreur lors de la planification manuelle");
      }
    } catch (error) {
      console.error("Error in manual scheduling:", error);
      toast.error("Erreur lors de la planification manuelle");
    } finally {
      setSchedulingInProgress(false);
    }
  };

  const handleGenerateTimeSlots = async () => {
    try {
      setIsGeneratingTimeSlots(true);
      const response = await axios.post("/api/generate-timeslots");

      if (response.data.status === 'success') {
        toast.success(response.data.message || "Créneaux horaires générés avec succès");
        queryClient.invalidateQueries({ queryKey: ["time-slots"] });
      } else {
        toast.error("Erreur lors de la génération des créneaux horaires");
      }
    } catch (error) {
      console.error("Error generating time slots:", error);
      toast.error("Erreur lors de la génération des créneaux horaires");
    } finally {
      setIsGeneratingTimeSlots(false);
    }
  };

  // Filtrer les examens non assignés
  const unassignedExams = exams?.filter(exam => !exam.room);
  // Filtrer les salles disponibles
  const availableRooms = rooms?.filter(room => room.status === "available");
  // Filtrer les créneaux non assignés
  const availableTimeSlots = timeSlots?.filter(slot => !slot.exam);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Planification des Examens</h1>

      <Tabs defaultValue="automatic">
        <TabsList className="mb-4">
          <TabsTrigger value="automatic">Planification Automatique</TabsTrigger>
          <TabsTrigger value="manual">Planification Manuelle</TabsTrigger>
        </TabsList>

        <TabsContent value="automatic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LucideSettings className="mr-2" />
                Optimisation de la Planification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                La planification automatique utilisera un algorithme d'optimisation pour assigner les examens aux salles et aux créneaux horaires, en respectant toutes les contraintes définies.
              </p>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="font-medium text-center mb-2">Examens non assignés</div>
                  <div className="text-3xl font-bold text-center">
                    {isLoadingExams ? <Skeleton className="h-8 w-16 mx-auto" /> : unassignedExams?.length || 0}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="font-medium text-center mb-2">Salles disponibles</div>
                  <div className="text-3xl font-bold text-center">
                    {isLoadingRooms ? <Skeleton className="h-8 w-16 mx-auto" /> : availableRooms?.length || 0}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="font-medium text-center mb-2">Créneaux disponibles</div>
                  <div className="text-3xl font-bold text-center">
                    {isLoadingTimeSlots ? <Skeleton className="h-8 w-16 mx-auto" /> : availableTimeSlots?.length || 0}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="font-medium text-center mb-2">Surveillants</div>
                  <div className="text-3xl font-bold text-center">
                    {isLoadingProctors ? <Skeleton className="h-8 w-16 mx-auto" /> : proctors?.length || 0}
                  </div>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="mt-2 bg-green-600 hover:bg-green-700" 
                onClick={handleAutomaticScheduling}
                disabled={schedulingInProgress || !unassignedExams?.length || !availableRooms?.length || !availableTimeSlots?.length}
                className="w-full"
              >
                {schedulingInProgress ? "Planification en cours..." : "Lancer la planification automatique"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LucideCalendar className="mr-2" />
                Planification Manuelle des Examens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exam">Examen</Label>
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger id="exam" className="w-full">
                      <SelectValue placeholder="Sélectionner un examen" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingExams ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : (
                        unassignedExams?.map(exam => (
                          <SelectItem key={exam.id} value={exam.id.toString()}>
                            {exam.name} ({exam.level}, {exam.department})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="room">Salle</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger id="room" className="w-full">
                      <SelectValue placeholder="Sélectionner une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingRooms ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : (
                        availableRooms?.map(room => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.name} (Capacité: {room.capacity})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeSlot">Créneau horaire</Label>
                  <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <SelectTrigger id="timeSlot" className="w-full">
                      <SelectValue placeholder="Sélectionner un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingTimeSlots ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : availableTimeSlots?.length === 0 ? (
                        <SelectItem value="empty" disabled>Aucun créneau disponible</SelectItem>
                      ) : (
                        availableTimeSlots?.map(slot => {
                          const startTime = new Date(slot.start_time);
                          const endTime = new Date(slot.end_time);
                          const durationHours = (endTime - startTime) / (1000 * 60 * 60);
                          const durationLabel = durationHours === 1 ? "1h" : durationHours === 2 ? "2h" : "3h";

                          return (
                            <SelectItem key={slot.id} value={slot.id.toString()}>
                              {startTime.toLocaleString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })} | {durationLabel} | ({startTime.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {endTime.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })})
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  {availableTimeSlots?.length === 0 && (
                    <Button 
                      className="mt-2 w-full" 
                      onClick={handleGenerateTimeSlots}
                      disabled={isGeneratingTimeSlots}
                    >
                      {isGeneratingTimeSlots ? "Génération en cours..." : "Générer des créneaux horaires"}
                    </Button>
                  )}
                </div>

                <div>
                  <Label htmlFor="proctors">Surveillants</Label>
                  <Select 
                    multiple
                    value={selectedProctors}
                    onValueChange={setSelectedProctors}
                  >
                    <SelectTrigger id="proctors" className="w-full">
                      <SelectValue placeholder="Sélectionner des surveillants" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingProctors ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : (
                        proctors?.map(proctor => (
                          <SelectItem key={proctor.id} value={proctor.id.toString()}>
                            {proctor.name} ({proctor.department})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.isArray(selectedProctors) && selectedProctors.map(proctorId => {
                      const proctor = proctors?.find(p => p.id.toString() === proctorId);
                      return (
                        <Badge key={proctorId} variant="secondary" className="flex items-center gap-1">
                          <LucideUser className="h-3 w-3" />
                          {proctor?.name}
                          <button 
                            className="ml-1 text-xs"
                            onClick={() => setSelectedProctors(selectedProctors.filter(id => id !== proctorId))}
                          >
                            ×
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                  className="mt-4 w-full bg-green-600 hover:bg-green-700" 
                  onClick={handleManualScheduling}
                  disabled={schedulingInProgress || !selectedExam || !selectedRoom || !selectedTimeSlot || selectedProctors.length === 0}
                >
                  {schedulingInProgress ? "Planification en cours..." : "Planifier"}
                </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}