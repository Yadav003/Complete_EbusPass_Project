import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, tokenStorage, isTokenExpired } from '@/services/auth.service';

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
  logout: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Helper: parse stored user 
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('ebuspass_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveUser = (user: User) => {
  localStorage.setItem('ebuspass_user', JSON.stringify(user));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const navigate = useNavigate();

  // On mount: validate access token, silently refresh if expired
  useEffect(() => {
    const validateSession = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken) return; // No session at all

      if (!isTokenExpired(accessToken)) return; // Token still valid, nothing to do

      // Access token expired — try to refresh
      if (!refreshToken || isTokenExpired(refreshToken)) {
        // Refresh token also expired → force logout
        tokenStorage.clear();
        setUser(null);
        navigate('/login', { replace: true });
        return;
      }

      try {
        const { accessToken: newAccess, refreshToken: newRefresh } = await authService.refreshToken();
        tokenStorage.setAccessToken(newAccess);
        tokenStorage.setRefreshToken(newRefresh);
      } catch {
        tokenStorage.clear();
        setUser(null);
        navigate('/login', { replace: true });
      }
    };

    validateSession();
  }, [navigate]);

  //Login 
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: apiUser, accessToken, refreshToken } = await authService.login({ email, password });
      const userData: User = {
        id: apiUser._id,
        name: apiUser.fullname,
        email: apiUser.email,
        mobile: apiUser.mobile,
        role: apiUser.role,
      };
      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setRefreshToken(refreshToken);
      setUser(userData);
      saveUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  // ─── Register 
  const register = async (data: { name: string; email: string; mobile: string; password: string }): Promise<boolean> => {
    try {
      await authService.register({
        fullname: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });
      // Registration successful — do NOT log in automatically.
      // User must go through the login flow separately.
      return true;
    } catch {
      return false;
    }
  };

  // Admin Login 

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    if (email === 'admin@ebuspass.gov.in' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin_1',
        name: 'Administrator',
        email,
        mobile: '9999999999',
        role: 'admin',
      };
      setUser(adminUser);
      saveUser(adminUser);
      return true;
    }
    return false;
  };

  // Logout 
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // best-effort — clear client side regardless
    }
    tokenStorage.clear();
    setUser(null);
    navigate('/login', { replace: true });
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
