
"use client";
import type { Client } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, StickyNote } from 'lucide-react';
import { format } from 'date-fns';
import { APP_LOCALE } from '@/lib/constants';
import type { Timestamp } from 'firebase/firestore';

interface ClientDetailsCardProps {
  client: Client;
}

// Helper to convert Firestore Timestamp to Date
const toDate = (timestamp: string | Timestamp): Date => {
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return timestamp.toDate();
};


export function ClientDetailsCard({ client }: ClientDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl">{client.name}</CardTitle>
          <CardDescription>
             Client depuis le {format(toDate(client.createdAt), "PPP", { locale: APP_LOCALE })}
          </CardDescription>
        </div>
        {/* <Button variant="outline" size="sm" asChild>
          <Link href={`/clients/${client.id}/edit`}> <Edit className="mr-2 h-4 w-4" /> Modifier Client </Link>
        </Button> */}
      </CardHeader>
      <CardContent className="space-y-4">
        {client.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{client.phone}</span>
          </div>
        )}
        {client.notes && (
          <div className="flex items-start gap-3">
            <StickyNote className="h-5 w-5 text-muted-foreground mt-0.5" />
            <p className="text-sm bg-accent/50 p-3 rounded-md border border-dashed">{client.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
