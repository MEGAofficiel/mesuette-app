
"use client";
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { ClientDetailsCard } from '@/app/(components)/clients/client-details-card';
import { MeasurementHistory } from '@/app/(components)/measurements/measurement-history';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, ArrowLeft, Trash2, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Client } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getClientById, getMeasurementsByClientId, deleteClient } = useAppContext();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null | undefined>(undefined); // undefined for loading, null for not found

  const clientId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (clientId) {
      const foundClient = getClientById(clientId);
      setClient(foundClient || null);
    }
  }, [clientId, getClientById]);

  if (client === undefined) {
    return <div className="flex justify-center items-center h-64">Loading client details...</div>;
  }

  if (!client) {
    return (
      <div className="text-center py-10">
        <UserX className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Client Not Found</h2>
        <p className="text-muted-foreground mb-6">The client you are looking for does not exist or may have been deleted.</p>
        <Button asChild variant="outline">
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients List
          </Link>
        </Button>
      </div>
    );
  }

  const measurements = getMeasurementsByClientId(client.id);

  const handleDeleteClient = () => {
    deleteClient(client.id);
    toast({
      title: "Client Deleted",
      description: `${client.name} and all associated measurements have been deleted.`,
    });
    router.push('/clients');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/clients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
        </Button>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Client
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete {client.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the client and all their associated measurements.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClient}>Delete Client</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button asChild size="sm">
            <Link href={`/clients/${client.id}/add-measurement`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Measurement
            </Link>
          </Button>
        </div>
      </div>
      
      <ClientDetailsCard client={client} />
      <MeasurementHistory clientId={client.id} measurements={measurements} />
    </div>
  );
}
