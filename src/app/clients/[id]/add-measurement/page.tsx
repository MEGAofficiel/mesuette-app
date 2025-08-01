
"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MeasurementForm, type MeasurementFormValues } from '@/app/(components)/measurements/measurement-form';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import type { Measurement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserX } from 'lucide-react';
import Link from 'next/link';

export default function AddMeasurementPage() {
  const router = useRouter();
  const params = useParams();
  const { addMeasurement, getClientById } = useAppContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientId = typeof params.id === 'string' ? params.id : '';
  const client = getClientById(clientId);

  if (!client) {
    return (
      <div className="text-center py-10">
        <UserX className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Client Non Trouvé</h2>
        <p className="text-muted-foreground mb-6">Impossible d'ajouter une mesure car le client n'a pas été trouvé.</p>
        <Button asChild variant="outline">
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Liste des Clients
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (data: MeasurementFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert string values from form back to numbers where appropriate
      const processedMeasurements: Record<string, number> = {};
      for (const [key, value] of Object.entries(data.measurements)) {
        if (value && String(value).trim() !== "") {
          const num = parseFloat(String(value));
          if (!isNaN(num)) {
            processedMeasurements[key] = num;
          }
        }
      }

      const measurementData = {
        clientId: client.id,
        date: data.date.toISOString(),
        garmentType: data.garmentType,
        gender: data.gender,
        notes: data.notes || "",
        measurements: processedMeasurements,
      };
      
      await addMeasurement(measurementData);
      
      toast({
        title: "Mesure Ajoutée",
        description: `Nouvelle mesure ${data.garmentType} pour ${client.name} ajoutée avec succès.`,
      });
      router.push(`/clients/${client.id}`);
    } catch (error) {
      console.error("Failed to add measurement:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'ajout de la mesure. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter Mesure pour {client.name}</h1>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Client
        </Button>
      </div>
      <MeasurementForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
