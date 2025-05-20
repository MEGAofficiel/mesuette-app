
"use client";
import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Client, Measurement } from '@/lib/types';

interface AppContextType {
  clients: Client[];
  measurements: Measurement[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (client: Client) => void;
  getClientById: (id: string) => Client | undefined;
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => Measurement;
  getMeasurementsByClientId: (clientId: string) => Measurement[];
  deleteClient: (clientId: string) => void;
  deleteMeasurement: (measurementId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialClients: Client[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '555-1234', notes: 'Prefers classic fit.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-5678', notes: 'Allergic to wool.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
];

const initialMeasurements: Measurement[] = [
  { 
    id: 'm1', 
    clientId: '1', 
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), 
    garmentType: 'shirt', 
    gender: 'male',
    measurements: { 'Neck Circumference': 15.5, 'Chest Circumference': 40, 'Waist Circumference (Shirt)': 34, 'Overall Length': 29, 'Sleeve Length': 25, 'Shoulder Width': 18 },
    notes: 'For a business shirt.'
  },
  { 
    id: 'm2', 
    clientId: '2', 
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), 
    garmentType: 'dress', 
    gender: 'female',
    measurements: { 'Bust Circumference': 36, 'Waist Circumference (Dress)': 28, 'Hip Circumference (Dress)': 38, 'Full Length (Shoulder to Hem)': 40, 'Sleeve Length (Dress)': 10, 'Shoulder Width (Dress)': 15 },
    notes: 'Summer dress, A-line.'
  },
];


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading from local storage or API for persistence demonstration
    // For now, just use initial data
    setClients(initialClients);
    setMeasurements(initialMeasurements);
    setIsLoaded(true);
  }, []);


  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = { 
      ...clientData, 
      id: String(Date.now() + Math.random()), 
      createdAt: new Date().toISOString() 
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const getClientById = (id: string): Client | undefined => {
    return clients.find(c => c.id === id);
  };

  const addMeasurement = (measurementData: Omit<Measurement, 'id'>): Measurement => {
    const newMeasurement: Measurement = { ...measurementData, id: String(Date.now() + Math.random()) };
    setMeasurements(prev => [...prev, newMeasurement]);
    return newMeasurement;
  };

  const getMeasurementsByClientId = (clientId: string): Measurement[] => {
    return measurements.filter(m => m.clientId === clientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setMeasurements(prev => prev.filter(m => m.clientId !== clientId)); // Also delete associated measurements
  };

  const deleteMeasurement = (measurementId: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== measurementId));
  };

  return (
    <AppContext.Provider value={{ clients, measurements, addClient, updateClient, getClientById, addMeasurement, getMeasurementsByClientId, deleteClient, deleteMeasurement }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
