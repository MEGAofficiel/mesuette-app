import type { GarmentType, Gender } from './constants';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string; // ISO date string
}

export interface Measurement {
  id: string;
  clientId: string;
  date: string; // ISO date string
  garmentType: GarmentType;
  gender: Gender;
  measurements: Record<string, number | string>; // Store as string initially from form, convert to number where applicable
  notes?: string;
}
