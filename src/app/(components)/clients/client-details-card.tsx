
"use client";
import type { Client } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Edit, StickyNote, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

interface ClientDetailsCardProps {
  client: Client;
}

export function ClientDetailsCard({ client }: ClientDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl">{client.name}</CardTitle>
          <CardDescription>
             Client since {format(new Date(client.createdAt), "MMMM d, yyyy")}
          </CardDescription>
        </div>
        {/* <Button variant="outline" size="sm" asChild>
          <Link href={`/clients/${client.id}/edit`}> <Edit className="mr-2 h-4 w-4" /> Edit Client </Link>
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
