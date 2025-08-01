
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GARMENT_TYPES, GENDERS, getMeasurementFields, type GarmentType, type Gender, APP_LOCALE } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Measurement } from '@/lib/types';

// Base schema for dynamic fields
const measurementValueSchema = z.string().refine(val => {
  if (val === "" || val === undefined || val === null) return true; // Allow empty strings
  const num = parseFloat(val);
  return !isNaN(num) && num >= 0; // Allow 0 and positive numbers
}, {
  message: "Doit être un nombre positif ou zéro.",
}).optional().or(z.literal(''));


const measurementFormSchema = z.object({
  date: z.date({ required_error: "Une date pour la mesure est requise." }),
  garmentType: z.enum(GARMENT_TYPES.map(gt => gt.id) as [GarmentType, ...GarmentType[]], {
    required_error: "Veuillez sélectionner un type de vêtement.",
  }),
  gender: z.enum(GENDERS.map(g => g.id) as [Gender, ...Gender[]], {
    required_error: "Veuillez sélectionner un sexe.",
  }),
  notes: z.string().optional(),
  measurements: z.record(measurementValueSchema), 
});

export type MeasurementFormValues = z.infer<typeof measurementFormSchema>;

// Helper to convert Measurement to MeasurementFormValues
export const measurementToFormValues = (measurement?: Measurement | null): Partial<MeasurementFormValues> => {
  if (!measurement) {
    return {
      date: new Date(),
      garmentType: undefined,
      gender: undefined,
      notes: "",
      measurements: {},
    };
  }
  return {
    date: new Date(measurement.date),
    garmentType: measurement.garmentType,
    gender: measurement.gender,
    notes: measurement.notes || "",
    measurements: Object.fromEntries(
      Object.entries(measurement.measurements).map(([key, value]) => [key, String(value)])
    ),
  };
};


interface MeasurementFormProps {
  onSubmit: (data: MeasurementFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Partial<MeasurementFormValues>;
  formTitle?: string;
  submitButtonText?: string;
}

export function MeasurementForm({ 
    onSubmit, 
    isSubmitting = false, 
    initialData,
    formTitle = "Ajouter une nouvelle prise de mesures",
    submitButtonText = "Enregistrer les mesures"
}: MeasurementFormProps) {
  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: initialData || measurementToFormValues(null),
  });

  const watchedGarmentType = form.watch("garmentType");
  const watchedGender = form.watch("gender");
  const [currentMeasurementFields, setCurrentMeasurementFields] = useState<string[]>([]);

  useEffect(() => {
    // When initialData is available (editing mode), set garmentType and gender if they exist
    // This ensures the form is correctly initialized when initialData changes or is first set
    if (initialData?.garmentType && initialData?.gender) {
        form.setValue("garmentType", initialData.garmentType, { shouldDirty: true, shouldValidate: true });
        form.setValue("gender", initialData.gender, { shouldDirty: true, shouldValidate: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.garmentType, initialData?.gender, form.setValue]);


  useEffect(() => {
    if (watchedGarmentType && watchedGender) {
      const fields = getMeasurementFields(watchedGarmentType, watchedGender);
      setCurrentMeasurementFields(fields);
      
      // Preserve existing measurements if fields are still relevant, otherwise reset
      const newMeasurements: Record<string, string | undefined> = {};
      const existingMeasurements = form.getValues("measurements");

      fields.forEach(field => {
        newMeasurements[field] = existingMeasurements?.[field] || initialData?.measurements?.[field] || "";
      });
      form.setValue("measurements", newMeasurements, { shouldValidate: true });

    } else {
      setCurrentMeasurementFields([]);
      form.setValue("measurements", {}, { shouldValidate: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedGarmentType, watchedGender, form.setValue, form.getValues, initialData?.measurements]);
  
  // Reset form when initialData changes (e.g., navigating between edit pages or from add to edit)
  useEffect(() => {
    form.reset(initialData || measurementToFormValues(null));
  }, [initialData, form.reset, form]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de la prise de mesure</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: APP_LOCALE })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={APP_LOCALE}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="garmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de vêtement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type de vêtement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GARMENT_TYPES.map(gt => (
                          <SelectItem key={gt.id} value={gt.id}>{gt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexe pour la coupe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un sexe" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        {GENDERS.map(g => (
                          <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {currentMeasurementFields.length > 0 && watchedGarmentType !== 'other' && (
              <Card className="pt-4">
                <CardHeader className="p-4 pt-0">
                  <CardTitle className="text-xl">Saisir les mesures du client (en cm)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentMeasurementFields.map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={`measurements.${fieldName}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="ex: 34.5" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes sur les mesures</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        watchedGarmentType === 'other' 
                          ? "Veuillez détailler ici les mesures spécifiques pour ce type de vêtement."
                          : "Notes spécifiques pour cette série de mesures (ex: posture, aisance demandée)."
                      }
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!(watchedGarmentType && watchedGender) && (
                 <FormDescription className="text-sm text-muted-foreground">Sélectionner le type de vêtement et le sexe pour afficher les champs de mesure.</FormDescription>
            )}
            {currentMeasurementFields.length === 0 && (watchedGarmentType && watchedGender) && watchedGarmentType !== 'other' && (
                 <FormDescription className="text-sm text-destructive">Aucun champ de mesure configuré pour cette combinaison type de vêtement/sexe.</FormDescription>
            )}
             {watchedGarmentType === 'other' && watchedGender && (
                 <FormDescription className="text-sm text-muted-foreground">Pour le type "Autre", utilisez le champ "Notes sur les mesures" ci-dessus pour enregistrer les détails.</FormDescription>
            )}

            <Button type="submit" disabled={isSubmitting || (!form.formState.isValid || ((currentMeasurementFields.length === 0 && watchedGarmentType !== 'other' && !!watchedGarmentType && !!watchedGender)) )}>
              {isSubmitting ? "Enregistrement..." : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
