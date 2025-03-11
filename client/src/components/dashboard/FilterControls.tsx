import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterControlsProps {
  onFilter: (filters: {
    level: string;
    department: string;
    period: string;
  }) => void;
}

const filterSchema = z.object({
  level: z.string().optional(),
  department: z.string().optional(),
  period: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export default function FilterControls({ onFilter }: FilterControlsProps) {
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      level: 'all',
      department: 'all',
      period: 'all',
    }
  });

  useEffect(() => {
    // Animate in after mount
    setIsVisible(true);
  }, []);

  const handleSubmit = (values: FilterValues) => {
    onFilter({
      level: values.level === 'all' ? '' : values.level || '',
      department: values.department === 'all' ? '' : values.department || '',
      period: values.period === 'all' ? '' : values.period || '',
    });
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-500 text-sm">Promotion</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg">
                          <SelectValue placeholder="Toutes les promotions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Toutes les promotions</SelectItem>
                        <SelectItem value="l1">L1</SelectItem>
                        <SelectItem value="l2">L2</SelectItem>
                        <SelectItem value="l3">L3</SelectItem>
                        <SelectItem value="m1">M1</SelectItem>
                        <SelectItem value="m2">M2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex-1">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-500 text-sm">Filière</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg">
                          <SelectValue placeholder="Toutes les filières" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Toutes les filières</SelectItem>
                        <SelectItem value="informatique">Informatique</SelectItem>
                        <SelectItem value="mathematiques">Mathématiques</SelectItem>
                        <SelectItem value="physique">Physique</SelectItem>
                        <SelectItem value="chimie">Chimie</SelectItem>
                        <SelectItem value="biologie">Biologie</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex-1">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-500 text-sm">Période</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg">
                          <SelectValue placeholder="Toutes les périodes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Toutes les périodes</SelectItem>
                        <SelectItem value="current_week">Semaine actuelle</SelectItem>
                        <SelectItem value="next_week">Semaine prochaine</SelectItem>
                        <SelectItem value="current_month">Mois actuel</SelectItem>
                        <SelectItem value="may_2024">Mai 2024</SelectItem>
                        <SelectItem value="june_2024">Juin 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end items-end">
              <Button 
                type="submit" 
                className="btn-neon bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-6 py-2 transition-all duration-300"
              >
                <i className="fas fa-filter mr-2"></i>
                <span>Filtrer</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
