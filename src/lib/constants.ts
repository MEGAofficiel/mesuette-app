import type { Locale } from 'date-fns';
import { fr } from 'date-fns/locale';

export const APP_LOCALE: Locale = fr;

export const GARMENT_TYPES = [
  { id: 'shirt', label: 'Chemise' },
  { id: 'pants', label: 'Pantalon' },
  { id: 'dress', label: 'Robe' },
] as const;

export const GENDERS = [
  { id: 'male', label: 'Homme' },
  { id: 'female', label: 'Femme' },
] as const;

export type GarmentType = (typeof GARMENT_TYPES)[number]['id'];
export type Gender = (typeof GENDERS)[number]['id'];

// Define specific fields for each garment type and gender
export const MEASUREMENT_FIELDS_CONFIG: Record<
  GarmentType,
  { common: string[]; male: string[]; female: string[] }
> = {
  shirt: {
    common: ['Longueur Totale', 'Longueur de Manche', 'Largeur d\'Épaule'],
    male: ['Tour de Cou', 'Tour de Poitrine', 'Tour de Taille (Chemise)'],
    female: ['Tour de Cou', 'Tour de Buste', 'Tour de Taille (Chemise)', 'Tour de Hanches (Chemise)', 'Placement de Pince'],
  },
  pants: {
    common: ['Entrejambe', 'Longueur Extérieure', 'Tour de Cuisse', 'Tour de Genou', 'Ouverture Bas'],
    male: ['Tour de Taille (Pantalon)'],
    female: ['Tour de Taille (Pantalon)', 'Tour de Hanches (Pantalon)', 'Hauteur de Fourche'],
  },
  dress: {
    common: ['Longueur Totale (Épaule à Ourlet)', 'Longueur de Manche (Robe)', 'Largeur d\'Épaule (Robe)'],
    male: [], // Typically not applicable for dresses
    female: [
      'Tour de Buste',
      'Tour de Taille (Robe)',
      'Tour de Hanches (Robe)',
      'Épaule à Pointe de Poitrine',
      'Épaule à Taille',
      'Épaule à Hanches',
      'Tour de Biceps',
      'Largeur de Dos',
      'Longueur de Jupe (Taille à Ourlet)',
    ],
  },
};

export function getMeasurementFields(garmentType: GarmentType, gender: Gender): string[] {
  const config = MEASUREMENT_FIELDS_CONFIG[garmentType];
  if (!config) return [];

  let fields = [...config.common];
  if (gender === 'male') {
    fields = [...fields, ...config.male];
  } else if (gender === 'female') {
    fields = [...fields, ...config.female];
  }
  // Remove duplicates that might arise if a field is in common and gender-specific
  return Array.from(new Set(fields));
}
