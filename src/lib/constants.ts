
import type { Locale } from 'date-fns';
import { fr } from 'date-fns/locale';

export const APP_LOCALE: Locale = fr;

export const GARMENT_TYPES = [
  { id: 'shirt', label: 'Chemise' },
  { id: 'pants', label: 'Pantalon' },
  { id: 'dress', label: 'Robe' },
  { id: 'other', label: 'Autre' }, // Ajout de l'option "Autre"
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
    male: [], // Typically not applicable for dresses, but can be extended if needed
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
  other: { // Configuration pour "Autre"
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
  // Remove duplicates that might arise if a field is in common and gender-specific
  return Array.from(new Set(fields));
}
