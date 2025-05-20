
"use client";
import Link from 'next/link';
import type { Client } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface ClientListItemProps {
  client: Client;
}

export function ClientListItem({ client }: ClientListItemProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          {client.name}
        </CardTitle>
        <CardDescription>
          Added on {format(new Date(client.createdAt), "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{client.phone}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <Link href={`/clients/${client.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
