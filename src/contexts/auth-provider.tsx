"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useEffect } from 'react';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@example.com') {
          const demoUser: User = { id: '1', name: 'Demo User', email: 'demo@example.com' };
          setUser(demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials. Try demo@example.com'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (name: string, email: string) => {
     return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = { id: Date.now().toString(), name, email };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve();
      }, 500);
    });
  };

  const value = { user, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
