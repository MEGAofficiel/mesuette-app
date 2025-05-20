
"use client";
import type { Measurement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Shirt, Drama, Ruler, Trash2 } from 'lucide-react'; // RectangleHorizontal was too generic
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

interface MeasurementListItemProps {
  measurement: Measurement;
  onDelete: (measurementId: string) => void;
}

const garmentIcons: Record<Measurement['garmentType'], React.ElementType> = {
  shirt: Shirt,
  pants: Ruler, // Using Ruler as a generic measurement icon for pants
  dress: Drama,
};

export function MeasurementListItem({ measurement, onDelete }: MeasurementListItemProps) {
  const Icon = garmentIcons[measurement.garmentType] || Ruler;
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(measurement.id);
    toast({
      title: "Measurement Deleted",
      description: `Measurement from ${format(new Date(measurement.date), "PPP")} has been deleted.`,
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-150">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {measurement.garmentType.charAt(0).toUpperCase() + measurement.garmentType.slice(1)} - {measurement.gender.charAt(0).toUpperCase() + measurement.gender.slice(1)}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <CalendarDays className="h-3 w-3" />
          {format(new Date(measurement.date), "MMMM d, yyyy 'at' h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">
          {measurement.notes || "No specific notes for this measurement."}
        </p>
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer text-primary hover:underline">View Measurements</summary>
          <ul className="mt-1 pl-4 list-disc list-inside bg-accent/30 p-2 rounded-md">
            {Object.entries(measurement.measurements).map(([key, value]) => (
              <li key={key}>
                <span className="font-medium">{key}:</span> {value} cm
              </li>
            ))}
          </ul>
        </details>
      </CardContent>
      <CardFooter className="flex justify-end">
         <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this measurement record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </CardFooter>
    </Card>
  );
}
