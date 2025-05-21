
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClientListItem } from '@/app/(components)/clients/client-list-item';
import { useAppContext } from '@/context/app-context';
import { PlusCircle, Users } from 'lucide-react';
import Image from 'next/image';

export default function ClientsPage() {
  const { clients } = useAppContext();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Clients
        </h1>
        <Button asChild>
          <Link href="/clients/add" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Ajouter Nouveau Client
          </Link>
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12">
          <Image 
            src="https://placehold.co/300x200.png" 
            alt="Illustration aucun client" 
            width={300} 
            height={200}
            data-ai-hint="empty state illustration"
            className="mx-auto mb-6 rounded-lg shadow-md"
          />
          <h2 className="text-2xl font-semibold mb-2">Aucun Client Pour l'Instant</h2>
          <p className="text-muted-foreground mb-6">Commencez par ajouter votre premier client.</p>
          <Button asChild size="lg">
            <Link href="/clients/add">
              <PlusCircle className="mr-2 h-5 w-5" /> Ajouter le Premier Client
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientListItem key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
