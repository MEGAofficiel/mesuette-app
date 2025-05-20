
"use client";
import type { Measurement } from '@/lib/types';
import { MeasurementListItem } from './measurement-list-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Ruler } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';

interface MeasurementHistoryProps {
  clientId: string;
  measurements: Measurement[];
}

export function MeasurementHistory({ clientId, measurements: initialMeasurements }: MeasurementHistoryProps) {
  const { deleteMeasurement, getMeasurementsByClientId } = useAppContext(); // Use this to get live data
  
  // Use live data from context rather than potentially stale props
  const measurements = getMeasurementsByClientId(clientId);


  const handleDeleteMeasurement = (measurementId: string) => {
    deleteMeasurement(measurementId);
    // The list will re-render due to context update
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Measurement History
        </CardTitle>
        <CardDescription>
          All recorded measurements for this client, sorted by most recent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {measurements.length === 0 ? (
          <div className="text-center py-8">
            <Image 
              src="https://placehold.co/200x150.png" 
              alt="No measurements placeholder" 
              width={200} 
              height={150}
              data-ai-hint="empty state ruler"
              className="mx-auto mb-4 rounded-md"
            />
            <p className="text-muted-foreground mb-4">No measurements recorded for this client yet.</p>
            <Button asChild>
              <Link href={`/clients/${clientId}/add-measurement`}>
                <Ruler className="mr-2 h-4 w-4" /> Add First Measurement
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {measurements.map((measurement) => (
              <MeasurementListItem key={measurement.id} measurement={measurement} onDelete={handleDeleteMeasurement} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
