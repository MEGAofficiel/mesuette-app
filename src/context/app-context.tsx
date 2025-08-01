
"use client";
import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Client, Measurement, MeasurementStatus } from '@/lib/types';

interface AppContextType {
  clients: Client[];
  measurements: Measurement[];
  loading: boolean;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<Client>;
  updateClient: (client: Partial<Client> & { id: string }) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  addMeasurement: (measurement: Omit<Measurement, 'id' | 'status'>) => Promise<Measurement>;
  getMeasurementsByClientId: (clientId: string) => Measurement[];
  getMeasurementById: (measurementId: string) => Measurement | undefined;
  updateMeasurement: (updatedMeasurement: Partial<Measurement> & { id: string }) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  deleteMeasurement: (measurementId: string) => Promise<void>;
  updateMeasurementStatus: (measurementId: string, status: MeasurementStatus) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for clients
  useEffect(() => {
    const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Client));
      setClients(clientsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching clients: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  // Real-time listener for measurements
  useEffect(() => {
    const q = query(collection(db, "measurements"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const measurementsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Measurement));
      setMeasurements(measurementsData);
    }, (error) => {
      console.error("Error fetching measurements: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    const docRef = await addDoc(collection(db, "clients"), {
      ...clientData,
      createdAt: serverTimestamp(),
    });
    return { ...clientData, id: docRef.id, createdAt: new Date().toISOString() };
  }, []);

  const updateClient = useCallback(async (updatedClient: Partial<Client> & { id: string }) => {
    const clientRef = doc(db, "clients", updatedClient.id);
    await updateDoc(clientRef, updatedClient);
  }, []);

  const getClientById = useCallback((id: string): Client | undefined => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const addMeasurement = useCallback(async (measurementData: Omit<Measurement, 'id' | 'status'>): Promise<Measurement> => {
    const docRef = await addDoc(collection(db, "measurements"), { 
      ...measurementData, 
      status: 'inProgress' 
    });
    return { ...measurementData, id: docRef.id, status: 'inProgress' };
  }, []);
  
  const getMeasurementsByClientId = useCallback((clientId: string): Measurement[] => {
    return measurements.filter(m => m.clientId === clientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [measurements]);

  const getMeasurementById = useCallback((measurementId: string): Measurement | undefined => {
    return measurements.find(m => m.id === measurementId);
  }, [measurements]);

  const updateMeasurement = useCallback(async (updatedMeasurement: Partial<Measurement> & { id: string }) => {
    const measurementRef = doc(db, "measurements", updatedMeasurement.id);
    await updateDoc(measurementRef, updatedMeasurement);
  }, []);

  const updateMeasurementStatus = useCallback(async (measurementId: string, status: MeasurementStatus) => {
    const measurementRef = doc(db, "measurements", measurementId);
    await updateDoc(measurementRef, { status });
  }, []);

  const deleteClient = useCallback(async (clientId: string) => {
    // First, delete all measurements associated with the client
    const q = query(collection(db, "measurements"), where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(docSnapshot => deleteDoc(doc(db, "measurements", docSnapshot.id)));
    await Promise.all(deletePromises);
    
    // Then, delete the client
    await deleteDoc(doc(db, "clients", clientId));
  }, []);

  const deleteMeasurement = useCallback(async (measurementId: string) => {
    await deleteDoc(doc(db, "measurements", measurementId));
  }, []);

  const contextValue = useMemo(() => ({
    clients,
    measurements,
    loading,
    addClient,
    updateClient,
    getClientById,
    addMeasurement,
    getMeasurementsByClientId,
    getMeasurementById,
    updateMeasurement,
    deleteClient,
    deleteMeasurement,
    updateMeasurementStatus
  }), [
    clients, measurements, loading, addClient, updateClient, getClientById, 
    addMeasurement, getMeasurementsByClientId, getMeasurementById, 
    updateMeasurement, deleteClient, deleteMeasurement, updateMeasurementStatus
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
