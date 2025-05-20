
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { GARMENT_TYPES, GENDERS, getMeasurementFields, type GarmentType, type Gender } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Base schema for dynamic fields
const measurementValueSchema = z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
  message: "Must be a positive number.",
}).optional().or(z.literal(''));


const measurementFormSchema = z.object({
  date: z.date({ required_error: "A date for the measurement is required." }),
  garmentType: z.enum(GARMENT_TYPES.map(gt => gt.id) as [GarmentType, ...GarmentType[]], {
    required_error: "Please select a garment type.",
  }),
  gender: z.enum(GENDERS.map(g => g.id) as [Gender, ...Gender[]], {
    required_error: "Please select a gender.",
  }),
  notes: z.string().optional(),
  measurements: z.record(measurementValueSchema), // Dynamic fields
});

type MeasurementFormValues = z.infer<typeof measurementFormSchema>;

interface MeasurementFormProps {
  clientId: string;
  onSubmit: (data: MeasurementFormValues) => void;
  isSubmitting?: boolean;
}

export function MeasurementForm({ clientId, onSubmit, isSubmitting = false }: MeasurementFormProps) {
  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: {
      date: new Date(),
      garmentType: undefined,
      gender: undefined,
      notes: "",
      measurements: {},
    },
  });

  const watchedGarmentType = form.watch("garmentType");
  const watchedGender = form.watch("gender");
  const [currentMeasurementFields, setCurrentMeasurementFields] = useState<string[]>([]);

  useEffect(() => {
    if (watchedGarmentType && watchedGender) {
      const fields = getMeasurementFields(watchedGarmentType, watchedGender);
      setCurrentMeasurementFields(fields);
      // Reset measurements field when garment/gender changes to avoid stale data
      const newMeasurements: Record<string, string> = {};
      fields.forEach(field => {
        newMeasurements[field] = form.getValues(`measurements.${field}`) || "";
      });
      form.setValue("measurements", newMeasurements);

    } else {
      setCurrentMeasurementFields([]);
      form.setValue("measurements", {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedGarmentType, watchedGender, form.setValue, form.getValues]);


  const processAndSubmit = (data: MeasurementFormValues) => {
    const processedData = {
      ...data,
      measurements: Object.fromEntries(
        Object.entries(data.measurements)
          .filter(([, value]) => value && value.trim() !== "") // Filter out empty strings
          .map(([key, value]) => [key, parseFloat(value as string)]) // Convert to number
      ),
      date: data.date.toISOString(), // Convert date to ISO string
    };
    // @ts-ignore // We've transformed the data, TS might complain but it's intended
    onSubmit(processedData);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Measurement</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processAndSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Measurement</FormLabel>
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
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
                    <FormLabel>Garment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select garment type" />
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
                    <FormLabel>Gender for Fit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
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

            {currentMeasurementFields.length > 0 && (
              <Card className="pt-4">
                <CardHeader className="p-4 pt-0">
                  <CardTitle className="text-xl">Enter Client Measurements (in cm)</CardTitle>
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
                            <Input type="number" step="0.1" placeholder="e.g. 34.5" {...field} />
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
                  <FormLabel>Measurement Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific notes for this set of measurements (e.g., posture, requested ease)."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || currentMeasurementFields.length === 0}>
              {isSubmitting ? "Saving..." : "Save Measurement"}
            </Button>
            {currentMeasurementFields.length === 0 && (watchedGarmentType && watchedGender) && (
                 <FormDescription className="text-sm text-destructive">No measurement fields configured for this garment type and gender combination.</FormDescription>
            )}
            {currentMeasurementFields.length === 0 && !(watchedGarmentType && watchedGender) && (
                 <FormDescription className="text-sm text-muted-foreground">Select garment type and gender to see measurement fields.</FormDescription>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
