import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InsertExam, Room, Proctor } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { LucideCalendar, LucideArrowLeft, LucideClock } from "lucide-react";

// Schéma de validation
const examFormSchema = z.object({
  name: z.string()
    .min(3, { message: "Le nom doit contenir au moins 3 caractères." })
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères." }),
  date: z.date({
    required_error: "La date de l'examen est requise.",
  }),
  duration: z.string()
    .min(1, { message: "La durée est requise." }),
  level: z.enum(["l1", "l2", "l3", "m1", "m2"], {
    required_error: "Le niveau est requis.",
  }),
  department: z.enum(["informatique", "mathematiques", "physique", "chimie", "biologie", "autres"], {
    required_error: "Le département est requis.",
  }),
  participants: z.number()
    .min(1, { message: "Le nombre de participants doit être au moins 1." })
    .optional(),
  description: z.string().optional(),
});

export default function AddExam() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Récupérer les rooms et proctors
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });
  
  const { data: proctors = [] } = useQuery<Proctor[]>({
    queryKey: ["/api/proctors"],
  });
  
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
  
  // Form definition
  const form = useForm<z.infer<typeof examFormSchema>>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      duration: "1h30",
      level: "l3",
      department: "informatique",
      participants: 0,
      description: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof examFormSchema>) => {
    // Simuler l'envoi du formulaire
    toast({
      title: "Examen créé",
      description: "L'examen a été créé avec succès.",
    });
    
    // Rediriger vers la liste des examens
    setTimeout(() => {
      setLocation('/exams');
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => setLocation('/exams')}
          >
            <LucideArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Ajouter un examen</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'examen</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un nouvel examen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'examen</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Algorithmes et structures de données" {...field} />
                      </FormControl>
                      <FormDescription>
                        Le nom complet de l'examen.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date et heure</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP 'à' HH'h'mm", { locale: fr })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <LucideCalendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={fr}
                          />
                          <div className="p-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <LucideClock className="h-4 w-4 opacity-70" />
                              <Input
                                type="time"
                                value={format(field.value || new Date(), "HH:mm")}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':').map(Number);
                                  const newDate = new Date(field.value || new Date());
                                  newDate.setHours(hours);
                                  newDate.setMinutes(minutes);
                                  field.onChange(newDate);
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Date et heure de début de l'examen.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(levelLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(departmentLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une durée" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1h">1 heure</SelectItem>
                          <SelectItem value="1h30">1 heure 30</SelectItem>
                          <SelectItem value="2h">2 heures</SelectItem>
                          <SelectItem value="2h30">2 heures 30</SelectItem>
                          <SelectItem value="3h">3 heures</SelectItem>
                          <SelectItem value="4h">4 heures</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Nombre estimé d'étudiants qui passeront cet examen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optionnelle)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informations complémentaires sur l'examen..."
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Ajoutez des notes ou des informations spécifiques pour cet examen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <CardFooter className="flex justify-between px-0 pb-0">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setLocation('/exams')}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Créer l'examen
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}