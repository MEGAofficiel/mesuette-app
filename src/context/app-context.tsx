
"use client";
import type React from 'react';
import { createContext, useContext, useState } from 'react';
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

const initialClients: Client[] = [];
const initialMeasurements: Measurement[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);

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
    setMeasurements(prev => prev.filter(m => m.clientId !== clientId));
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
