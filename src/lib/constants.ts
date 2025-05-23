
import type { Locale } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { MeasurementStatusId } from './types'; // Import corrigé vers MeasurementStatusId (sera défini dans types.ts ou ici)

export const APP_LOCALE: Locale = fr;

export const GARMENT_TYPES = [
  { id: 'shirt', label: 'Chemise' },
  { id: 'pants', label: 'Pantalon' },
  { id: 'dress', label: 'Robe' },
  { id: 'other', label: 'Autre' },
] as const;

export const GENDERS = [
  { id: 'male', label: 'Homme' },
  { id: 'female', label: 'Femme' },
] as const;

export type GarmentType = (typeof GARMENT_TYPES)[number]['id'];
export type Gender = (typeof GENDERS)[number]['id'];

export const MEASUREMENT_FIELDS_CONFIG: Record<
  GarmentType,
  { common: string[]; male: string[]; female: string[] }
> = {
  shirt: {
    common: [
      'Longueur Totale',
      'Longueur de Manche',
      'Largeur d\'Épaule',
      'Tour de Biceps',
      'Tour de Poignet',
    ],
    male: [
      'Tour de Cou',
      'Tour de Poitrine',
      'Tour de Taille (Chemise)',
      'Tour de Hanches (Chemise)',
    ],
    female: [
      'Tour de Cou',
      'Tour de Buste',
      'Dessous de Poitrine',
      'Tour de Taille (Chemise)',
      'Tour de Hanches (Chemise)',
      'Placement de Pince (Hauteur)',
      'Écart Pince',
    ],
  },
  pants: {
    common: [
      'Entrejambe',
      'Longueur Extérieure',
      'Tour de Cuisse',
      'Tour de Genou',
      'Tour de Mollet',
      'Ouverture Bas',
      'Hauteur de Fourche Devant',
      'Hauteur de Fourche Dos',
    ],
    male: ['Tour de Taille (Pantalon)', 'Tour de Bassin (Pantalon)'],
    female: [
      'Tour de Taille (Pantalon)',
      'Tour de Hanches (Pantalon)',
      'Petites Hanches',
    ],
  },
  dress: {
    common: [
      'Longueur Totale (Épaule à Ourlet)',
      'Longueur de Manche (Robe)',
      'Largeur d\'Épaule (Robe)',
      'Tour de Biceps',
      'Tour de Poignet',
    ],
    male: [], 
    female: [
      'Tour de Buste',
      'Dessous de Poitrine',
      'Tour de Taille (Robe)',
      'Tour de Hanches (Robe)',
      'Petites Hanches',
      'Épaule à Pointe de Poitrine',
      'Épaule à Taille Devant',
      'Épaule à Taille Dos',
      'Épaule à Hanches',
      'Largeur de Dos (Carrure)',
      'Longueur de Jupe (Taille à Ourlet)',
      'Hauteur Genou',
    ],
  },
  other: { 
    common: [],
    male: [],
    female: [],
  },
};

export function getMeasurementFields(garmentType: GarmentType, gender: Gender): string[] {
  const config = MEASUREMENT_FIELDS_CONFIG[garmentType];
  if (!config) return [];

  let fields = [...config.common];
  if (gender === 'male' && config.male) {
    fields = [...fields, ...config.male];
  } else if (gender === 'female' && config.female) {
    fields = [...fields, ...config.female];
  }
  return Array.from(new Set(fields));
}

// Définition des statuts de mesure/commande
export const MEASUREMENT_STATUSES = {
  inProgress: { label: 'En cours', badgeVariant: 'outline' as const, badgeClassName: 'border-blue-500 text-blue-500' },
  completed: { label: 'Terminé', badgeVariant: 'secondary' as const, badgeClassName: 'bg-green-100 text-green-700 border-green-300' },
  delivered: { label: 'Livré', badgeVariant: 'default' as const, badgeClassName: 'bg-purple-600 text-purple-50 hover:bg-purple-700' },
} as const;

// Assurez-vous que MeasurementStatusId est exporté depuis types.ts ou défini ici si nécessaire.
// Pour l'instant, MeasurementStatusId est un alias pour MeasurementStatus de types.ts dans mon raisonnement.
// Si vous voulez utiliser MeasurementStatusId ici, vous pouvez le typer comme:
// export type MeasurementStatusId = keyof typeof MEASUREMENT_STATUSES;
// Mais il est préférable que MeasurementStatus (le type union) vienne de types.ts
// et que MEASUREMENT_STATUSES soit juste un objet de configuration.
