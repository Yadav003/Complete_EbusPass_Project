import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'student' | 'admin';
}

export interface Application {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  personalDetails: {
    fullName: string;
    dob: string;
    gender: string;
    mobile: string;
    email: string;
    address: string;
    collegeName: string;
    course: string;
    yearSemester: string;
  };
  documents: {
    aadhaar?: string;
    collegeId?: string;
    photo?: string;
  };
  route: {
    source: string;
    destination: string;
    distance: number;
    fare: number;
    routeId: string;
  };
  payment: {
    status: 'pending' | 'completed' | 'failed';
    amount: number;
    transactionId?: string;
    method?: string;
    date?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; mobile: string; password: string }) => Promise<boolean>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ebuspass_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('ebuspass_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        mobile: foundUser.mobile,
        role: 'student'
      };
      setUser(userData);
      localStorage.setItem('ebuspass_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (data: { name: string; email: string; mobile: string; password: string }): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('ebuspass_users') || '[]');
    const exists = users.find((u: any) => u.email === data.email);
    
    if (exists) return false;
    
    const newUser = {
      id: `user_${Date.now()}`,
      ...data,
      role: 'student'
    };
    
    users.push(newUser);
    localStorage.setItem('ebuspass_users', JSON.stringify(users));
    
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      role: 'student'
    };
    setUser(userData);
    localStorage.setItem('ebuspass_user', JSON.stringify(userData));
    return true;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@ebuspass.gov.in' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin_1',
        name: 'Administrator',
        email: email,
        mobile: '9999999999',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('ebuspass_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ebuspass_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
