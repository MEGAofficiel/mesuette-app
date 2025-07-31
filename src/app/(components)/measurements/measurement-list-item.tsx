
"use client";
import type { Measurement, MeasurementStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Shirt, Drama, Ruler, Trash2, Pencil, CheckCircle2, Truck } from 'lucide-react'; // Removed PlayCircle as it wasn't used
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { GARMENT_TYPES, GENDERS, APP_LOCALE, MEASUREMENT_STATUSES } from '@/lib/constants';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import { cn } from '@/lib/utils';

interface MeasurementListItemProps {
  measurement: Measurement;
  onDelete: (measurementId: string) => void;
}

const garmentIcons: Record<Measurement['garmentType'], React.ElementType> = {
  shirt: Shirt,
  pants: Ruler, 
  dress: Drama,
  other: Pencil, 
};

export function MeasurementListItem({ measurement, onDelete }: MeasurementListItemProps) {
  const { updateMeasurementStatus } = useAppContext();
  const Icon = garmentIcons[measurement.garmentType] || Ruler; 
  const { toast } = useToast();

  const garmentLabel = GARMENT_TYPES.find(gt => gt.id === measurement.garmentType)?.label || measurement.garmentType;
  const genderLabel = GENDERS.find(g => g.id === measurement.gender)?.label || measurement.gender;
  
  const formattedDate = format(new Date(measurement.date), "PPP", { locale: APP_LOCALE });
  const formattedTime = format(new Date(measurement.date), "p", { locale: APP_LOCALE });

  const statusInfo = MEASUREMENT_STATUSES[measurement.status];

  const handleDelete = () => {
    onDelete(measurement.id);
    toast({
      title: "Mesure Supprimée",
      description: `La mesure du ${formattedDate} a été supprimée.`,
    });
  };

  const handleUpdateStatus = (newStatus: MeasurementStatus) => {
    updateMeasurementStatus(measurement.id, newStatus);
    const newStatusLabel = MEASUREMENT_STATUSES[newStatus]?.label.toLowerCase() || 'inconnu';
    toast({
      title: "Statut mis à jour",
      description: `La commande est maintenant "${newStatusLabel}".`,
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-150">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon className="h-5 w-5 text-primary" />
              {garmentLabel} - {genderLabel}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs mt-1">
              <CalendarDays className="h-3 w-3" />
              {formattedDate} à {formattedTime}
            </CardDescription>
          </div>
          {statusInfo && (
            <Badge variant={statusInfo.badgeVariant} className={cn("text-xs", statusInfo.badgeClassName)}>
              {statusInfo.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
        
        {/* Section des actions de statut */}
        <div className="pt-2 border-t border-dashed">
          {measurement.status === 'inProgress' && (
            <Button onClick={() => handleUpdateStatus('completed')} size="sm" variant="outline" className="w-full sm:w-auto">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Marquer comme Terminé
            </Button>
          )}
          {measurement.status === 'completed' && (
            <Button onClick={() => handleUpdateStatus('delivered')} size="sm" variant="outline" className="w-full sm:w-auto">
              <Truck className="mr-2 h-4 w-4" /> Marquer comme Livré
            </Button>
          )}
          {measurement.status === 'delivered' && (
             <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start">
                <Truck className="mr-2 h-4 w-4 text-purple-600" /> Commande livrée.
             </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
         <Button asChild variant="outline" size="sm">
            <Link href={`/clients/${measurement.clientId}/measurements/${measurement.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Link>
          </Button>
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
