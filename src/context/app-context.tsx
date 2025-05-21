
"use client";
import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Client, Measurement } from '@/lib/types';
import { GARMENT_TYPES, GENDERS } from '@/lib/constants'; // For initial data labels if needed

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

// Using French labels for initial data where applicable
const initialClients: Client[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@example.com', phone: '0601020304', notes: 'Préfère une coupe classique.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@example.com', phone: '0701020304', notes: 'Allergique à la laine.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
];

const initialMeasurements: Measurement[] = [
  { 
    id: 'm1', 
    clientId: '1', 
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), 
    garmentType: 'shirt', 
    gender: 'male',
    measurements: { 
      'Tour de Cou': 39.5, 
      'Tour de Poitrine': 102, 
      'Tour de Taille (Chemise)': 86, 
      'Longueur Totale': 74, 
      'Longueur de Manche': 63.5, 
      'Largeur d\'Épaule': 46 
    },
    notes: 'Pour une chemise de ville.'
  },
  { 
    id: 'm2', 
    clientId: '2', 
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), 
    garmentType: 'dress', 
    gender: 'female',
    measurements: { 
      'Tour de Buste': 91.5, 
      'Tour de Taille (Robe)': 71, 
      'Tour de Hanches (Robe)': 96.5, 
      'Longueur Totale (Épaule à Ourlet)': 101.5, 
      'Longueur de Manche (Robe)': 25.5, 
      'Largeur d\'Épaule (Robe)': 38 
    },
    notes: 'Robe d\'été, coupe A.'
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
