
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientForm } from '@/app/(components)/clients/client-form';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import type { Client } from '@/lib/types';

export default function AddClientPage() {
  const router = useRouter();
  const { addClient } = useAppContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: Omit<Client, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      const newClient = addClient(data);
      toast({
        title: "Client Ajouté",
        description: `${newClient.name} a été ajouté avec succès.`,
      });
      router.push(`/clients/${newClient.id}`);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'ajout du client. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Ajouter Nouveau Client</h1>
      <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
