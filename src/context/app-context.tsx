
"use client";
import type React from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Client, Measurement } from '@/lib/types';

interface AppContextType {
  clients: Client[];
  measurements: Measurement[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (client: Client) => void;
  getClientById: (id: string) => Client | undefined;
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => Measurement;
  getMeasurementsByClientId: (clientId: string) => Measurement[];
  getMeasurementById: (measurementId: string) => Measurement | undefined; // Nouvelle fonction
  updateMeasurement: (updatedMeasurement: Measurement) => void; // Nouvelle fonction
  deleteClient: (clientId: string) => void;
  deleteMeasurement: (measurementId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: String(Date.now() + Math.random()),
      createdAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  }, []);

  const updateClient = useCallback((updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  }, []);

  const getClientById = useCallback((id: string): Client | undefined => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const addMeasurement = useCallback((measurementData: Omit<Measurement, 'id'>): Measurement => {
    const newMeasurement: Measurement = { ...measurementData, id: String(Date.now() + Math.random()) };
    setMeasurements(prev => [...prev, newMeasurement]);
    return newMeasurement;
  }, []);

  const getMeasurementsByClientId = useCallback((clientId: string): Measurement[] => {
    return measurements.filter(m => m.clientId === clientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [measurements]);

  const getMeasurementById = useCallback((measurementId: string): Measurement | undefined => {
    return measurements.find(m => m.id === measurementId);
  }, [measurements]);

  const updateMeasurement = useCallback((updatedMeasurement: Measurement) => {
    setMeasurements(prev => prev.map(m => m.id === updatedMeasurement.id ? updatedMeasurement : m));
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setMeasurements(prev => prev.filter(m => m.clientId !== clientId));
  }, []);

  const deleteMeasurement = useCallback((measurementId: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== measurementId));
  }, []);

  const contextValue = useMemo(() => ({
    clients,
    measurements,
    addClient,
    updateClient,
    getClientById,
    addMeasurement,
    getMeasurementsByClientId,
    getMeasurementById,
    updateMeasurement,
    deleteClient,
    deleteMeasurement
  }), [
    clients, measurements, addClient, updateClient, getClientById, 
    addMeasurement, getMeasurementsByClientId, getMeasurementById, 
    updateMeasurement, deleteClient, deleteMeasurement
  ]);

  return (
    <AppContext.Provider value={contextValue}>
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
