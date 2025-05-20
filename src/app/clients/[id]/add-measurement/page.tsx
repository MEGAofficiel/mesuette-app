
"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MeasurementForm } from '@/app/(components/measurements/measurement-form';
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
        <h2 className="text-2xl font-semibold mb-2">Client Not Found</h2>
        <p className="text-muted-foreground mb-6">Cannot add measurement as the client was not found.</p>
        <Button asChild variant="outline">
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients List
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (data: Omit<Measurement, 'id' | 'clientId'> & { date: string }) => {
    setIsSubmitting(true);
    try {
      const measurementData = {
        ...data,
        clientId: client.id,
      };
      // @ts-ignore // MeasurementForm already processes date to string
      addMeasurement(measurementData);
      toast({
        title: "Measurement Added",
        description: `New ${data.garmentType} measurement for ${client.name} has been successfully added.`,
      });
      router.push(`/clients/${client.id}`);
    } catch (error) {
      console.error("Failed to add measurement:", error);
      toast({
        title: "Error",
        description: "Failed to add measurement. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Add Measurement for {client.name}</h1>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Client
        </Button>
      </div>
      <MeasurementForm clientId={client.id} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
