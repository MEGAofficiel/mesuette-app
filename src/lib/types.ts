
import type { Timestamp } from 'firebase/firestore';
import type { GarmentType, Gender } from './constants';

export type MeasurementStatus = 'inProgress' | 'completed' | 'delivered';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string | Timestamp; // Can be ISO string from form or Timestamp from Firestore
}

export interface Measurement {
  id: string;
  clientId: string;
  date: string; // ISO date string
  garmentType: GarmentType;
  gender: Gender;
  measurements: Record<string, number>;
  notes?: string;
  status: MeasurementStatus;
}
