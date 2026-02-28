import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Application } from './AuthContext';

export interface College {
  id: string;
  name: string;
  address: string;
  district: string;
}

export interface Route {
  id: string;
  name: string;
  source: string;
  destination: string;
  stops: string[];
  distance: number;
  farePerKm: number;
  totalFare: number;
}

interface AppContextType {
  colleges: College[];
  routes: Route[];
  applications: Application[];
  addCollege: (college: Omit<College, 'id'>) => void;
  updateCollege: (id: string, college: Partial<College>) => void;
  deleteCollege: (id: string) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, route: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  getApplicationsByUser: (userId: string) => Application[];
  getUserApplication: (userId: string) => Application | undefined;
}

const defaultColleges: College[] = [
  { id: '1', name: 'Government Engineering College', address: 'Main Road', district: 'Central District' },
  { id: '2', name: 'State Medical College', address: 'Hospital Road', district: 'North District' },
  { id: '3', name: 'National Law University', address: 'Justice Lane', district: 'South District' },
  { id: '4', name: 'Arts and Science College', address: 'College Street', district: 'East District' },
  { id: '5', name: 'Polytechnic Institute', address: 'Industrial Area', district: 'West District' },
];

const defaultRoutes: Route[] = [
  { id: '1', name: 'Route A - Central Line', source: 'Central Bus Station', destination: 'University Campus', stops: ['Main Market', 'City Center', 'Tech Park'], distance: 15, farePerKm: 2, totalFare: 30 },
  { id: '2', name: 'Route B - North Express', source: 'North Terminal', destination: 'Medical College', stops: ['Railway Station', 'Hospital Junction'], distance: 20, farePerKm: 2, totalFare: 40 },
  { id: '3', name: 'Route C - South Corridor', source: 'South Gate', destination: 'Law University', stops: ['Court Complex', 'Secretariat'], distance: 12, farePerKm: 2, totalFare: 24 },
  { id: '4', name: 'Route D - East Circle', source: 'East Point', destination: 'Arts College', stops: ['Museum', 'Library'], distance: 8, farePerKm: 2, totalFare: 16 },
  { id: '5', name: 'Route E - West Link', source: 'West Hub', destination: 'Polytechnic', stops: ['Industrial Zone', 'Factory Area'], distance: 25, farePerKm: 2, totalFare: 50 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [colleges, setColleges] = useState<College[]>(() => {
    const stored = localStorage.getItem('ebuspass_colleges');
    return stored ? JSON.parse(stored) : defaultColleges;
  });

  const [routes, setRoutes] = useState<Route[]>(() => {
    const stored = localStorage.getItem('ebuspass_routes');
    return stored ? JSON.parse(stored) : defaultRoutes;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const stored = localStorage.getItem('ebuspass_applications');
    return stored ? JSON.parse(stored) : [];
  });

  const saveColleges = (data: College[]) => {
    setColleges(data);
    localStorage.setItem('ebuspass_colleges', JSON.stringify(data));
  };

  const saveRoutes = (data: Route[]) => {
    setRoutes(data);
    localStorage.setItem('ebuspass_routes', JSON.stringify(data));
  };

  const saveApplications = (data: Application[]) => {
    setApplications(data);
    localStorage.setItem('ebuspass_applications', JSON.stringify(data));
  };

  const addCollege = (college: Omit<College, 'id'>) => {
    const newCollege = { ...college, id: `college_${Date.now()}` };
    saveColleges([...colleges, newCollege]);
  };

  const updateCollege = (id: string, updates: Partial<College>) => {
    saveColleges(colleges.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCollege = (id: string) => {
    saveColleges(colleges.filter(c => c.id !== id));
  };

  const addRoute = (route: Omit<Route, 'id'>) => {
    const newRoute = { ...route, id: `route_${Date.now()}` };
    saveRoutes([...routes, newRoute]);
  };

  const updateRoute = (id: string, updates: Partial<Route>) => {
    saveRoutes(routes.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoute = (id: string) => {
    saveRoutes(routes.filter(r => r.id !== id));
  };

  const addApplication = (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const now = new Date().toISOString();
    const newApp: Application = {
      ...application,
      id: `app_${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    saveApplications([...applications, newApp]);
    return newApp.id;
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    saveApplications(applications.map(a => 
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    ));
  };

  const getApplicationsByUser = (userId: string) => {
    return applications.filter(a => a.userId === userId);
  };

  const getUserApplication = (userId: string) => {
    return applications.find(a => a.userId === userId);
  };

  return (
    <AppContext.Provider value={{
      colleges,
      routes,
      applications,
      addCollege,
      updateCollege,
      deleteCollege,
      addRoute,
      updateRoute,
      deleteRoute,
      addApplication,
      updateApplication,
      getApplicationsByUser,
      getUserApplication,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
