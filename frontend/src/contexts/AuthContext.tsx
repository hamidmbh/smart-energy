import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { usersDB } from '@/services/database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Find user in database
    const foundUser = usersDB.query(u => u.email === email)[0];
    
    if (!foundUser) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // In a real app, verify password here
    // For now, accept any password for demo purposes
    
    localStorage.setItem('user', JSON.stringify(foundUser));
    localStorage.setItem('token', 'mock-jwt-token');
    setUser(foundUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
