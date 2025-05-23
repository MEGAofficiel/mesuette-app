
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MeasurementForm, type MeasurementFormValues, measurementToFormValues } from '@/app/(components)/measurements/measurement-form';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import type { Measurement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserX, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function EditMeasurementPage() {
  const router = useRouter();
  const params = useParams();
  const { updateMeasurement, getClientById, getMeasurementById } = useAppContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<Partial<MeasurementFormValues> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [originalMeasurement, setOriginalMeasurement] = useState<Measurement | null | undefined>(undefined);

  const clientId = typeof params.id === 'string' ? params.id : '';
  const measurementId = typeof params.measurementId === 'string' ? params.measurementId : '';

  const client = getClientById(clientId);
  
  const loadMeasurementData = useCallback(() => {
    if (measurementId) {
      const measurementData = getMeasurementById(measurementId);
      if (measurementData) {
        setOriginalMeasurement(measurementData); // Sauvegarde de la mesure originale pour le statut
        setInitialFormValues(measurementToFormValues(measurementData));
      } else {
        setInitialFormValues(undefined); 
        toast({
          title: "Mesure non trouvée",
          description: "Impossible de charger les données de la mesure pour modification.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  }, [measurementId, getMeasurementById, toast]);

  useEffect(() => {
    setIsLoading(true);
    loadMeasurementData();
  }, [loadMeasurementData]);


  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement des données de mesure...</div>;
  }

  if (!client) {
    return (
      <div className="text-center py-10">
        <UserX className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Client Non Trouvé</h2>
        <p className="text-muted-foreground mb-6">Impossible de modifier la mesure car le client n'a pas été trouvé.</p>
        <Button asChild variant="outline">
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Liste des Clients
          </Link>
        </Button>
      </div>
    );
  }

  if (!initialFormValues && !isLoading) {
     return (
      <div className="text-center py-10">
        <FileQuestion className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Mesure Non Trouvée</h2>
        <p className="text-muted-foreground mb-6">Les données pour cette mesure n'ont pas pu être chargées.</p>
        <Button asChild variant="outline">
          <Link href={`/clients/${clientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Client
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (data: MeasurementFormValues) => {
    if (!originalMeasurement) {
        toast({ title: "Erreur", description: "Données originales de mesure non trouvées.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    try {
      const processedMeasurements: Record<string, number> = {};
      for (const [key, value] of Object.entries(data.measurements)) {
        if (value && String(value).trim() !== "") {
          processedMeasurements[key] = parseFloat(String(value));
        }
      }

      const updatedMeasurementData: Measurement = {
        id: measurementId,
        clientId: clientId,
        date: data.date.toISOString(),
        garmentType: data.garmentType,
        gender: data.gender,
        measurements: processedMeasurements,
        notes: data.notes,
        status: originalMeasurement.status, // Préserver le statut original
      };
      
      updateMeasurement(updatedMeasurementData);
      toast({
        title: "Mesure Modifiée",
        description: `La mesure ${data.garmentType} pour ${client.name} a été modifiée avec succès.`,
      });
      router.push(`/clients/${client.id}`);
    } catch (error) {
      console.error("Failed to update measurement:", error);
      toast({
        title: "Erreur de Modification",
        description: "Échec de la modification de la mesure. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Modifier Mesure pour {client.name}</h1>
        <Button variant="outline" size="sm" onClick={() => router.push(`/clients/${clientId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Client
        </Button>
      </div>
      {initialFormValues && (
        <MeasurementForm 
          initialData={initialFormValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          formTitle="Modifier les informations de la mesure"
          submitButtonText="Enregistrer les modifications"
        />
      )}
    </div>
  );
}
