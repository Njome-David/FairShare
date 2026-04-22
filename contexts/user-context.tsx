'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  pseudo: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (pseudo: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fairshare_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('fairshare_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (pseudo: string) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo }),
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la connexion');
    }

    const data = await res.json();
    setUser(data);
    localStorage.setItem('fairshare_user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fairshare_user');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}