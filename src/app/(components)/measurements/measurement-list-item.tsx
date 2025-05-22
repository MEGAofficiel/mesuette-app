
"use client";
import type { Measurement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Shirt, Drama, Ruler, Trash2, PencilLine } from 'lucide-react'; 
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { GARMENT_TYPES, GENDERS, APP_LOCALE } from '@/lib/constants';

interface MeasurementListItemProps {
  measurement: Measurement;
  onDelete: (measurementId: string) => void;
}

const garmentIcons: Record<Measurement['garmentType'], React.ElementType> = {
  shirt: Shirt,
  pants: Ruler, 
  dress: Drama,
  other: PencilLine, 
};

export function MeasurementListItem({ measurement, onDelete }: MeasurementListItemProps) {
  const Icon = garmentIcons[measurement.garmentType] || Ruler; 
  const { toast } = useToast();

  const garmentLabel = GARMENT_TYPES.find(gt => gt.id === measurement.garmentType)?.label || measurement.garmentType;
  const genderLabel = GENDERS.find(g => g.id === measurement.gender)?.label || measurement.gender;
  
  const formattedDate = format(new Date(measurement.date), "PPP", { locale: APP_LOCALE });
  const formattedTime = format(new Date(measurement.date), "p", { locale: APP_LOCALE });


  const handleDelete = () => {
    onDelete(measurement.id);
    toast({
      title: "Mesure Supprimée",
      description: `La mesure du ${format(new Date(measurement.date), "PPP", { locale: APP_LOCALE })} a été supprimée.`,
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-150">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {garmentLabel} - {genderLabel}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <CalendarDays className="h-3 w-3" />
          {formattedDate} à {formattedTime}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">
          {measurement.notes || "Aucune note spécifique pour cette mesure."}
        </p>
        {Object.keys(measurement.measurements).length > 0 ? (
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer text-primary hover:underline">Voir les Mesures</summary>
            <ul className="mt-1 pl-4 list-disc list-inside bg-accent/30 p-2 rounded-md">
              {Object.entries(measurement.measurements).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium">{key}:</span> {value} cm
                </li>
              ))}
            </ul>
          </details>
        ) : (
           garmentLabel !== 'Autre' && <p className="mt-2 text-xs text-muted-foreground">Aucune mesure spécifique enregistrée.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
         <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera définitivement cet enregistrement de mesure.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </CardFooter>
    </Card>
  );
}
