export const GARMENT_TYPES = [
  { id: 'shirt', label: 'Shirt' },
  { id: 'pants', label: 'Pants' },
  { id: 'dress', label: 'Dress' },
] as const;

export const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
] as const;

export type GarmentType = (typeof GARMENT_TYPES)[number]['id'];
export type Gender = (typeof GENDERS)[number]['id'];

// Define specific fields for each garment type and gender
export const MEASUREMENT_FIELDS_CONFIG: Record<
  GarmentType,
  { common: string[]; male: string[]; female: string[] }
> = {
  shirt: {
    common: ['Overall Length', 'Sleeve Length', 'Shoulder Width'],
    male: ['Neck Circumference', 'Chest Circumference', 'Waist Circumference (Shirt)'],
    female: ['Neck Circumference', 'Bust Circumference', 'Waist Circumference (Shirt)', 'Hip Circumference (Shirt)', 'Dart Placement'],
  },
  pants: {
    common: ['Inseam', 'Outseam', 'Thigh Circumference', 'Knee Circumference', 'Cuff Opening'],
    male: ['Waist Circumference (Pants)'],
    female: ['Waist Circumference (Pants)', 'Hip Circumference (Pants)', 'Rise'],
  },
  dress: {
    common: ['Full Length (Shoulder to Hem)', 'Sleeve Length (Dress)', 'Shoulder Width (Dress)'],
    male: [], // Typically not applicable for dresses
    female: [
      'Bust Circumference',
      'Waist Circumference (Dress)',
      'Hip Circumference (Dress)',
      'Shoulder to Bust Point',
      'Shoulder to Waist',
      'Shoulder to Hip',
      'Bicep Circumference',
      'Back Width',
      'Skirt Length (Waist to Hem)',
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
