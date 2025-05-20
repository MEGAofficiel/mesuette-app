
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
        title: "Client Added",
        description: `${newClient.name} has been successfully added.`,
      });
      router.push(`/clients/${newClient.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
      <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
