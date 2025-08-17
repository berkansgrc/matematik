"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useEffect } from 'react';
import type { User, UserProgress } from '@/lib/types';
import { users as mockUsers, userProgress as mockProgress } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  progress: UserProgress;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<void>;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedProgress = localStorage.getItem('userProgress');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        if(storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }
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
          const demoProgress = { 
            'react-fundamentals': { completedLessons: ['l1-1', 'l1-2'] }
          };
          setUser(demoUser);
          setProgress(demoProgress);
          localStorage.setItem('user', JSON.stringify(demoUser));
          localStorage.setItem('userProgress', JSON.stringify(demoProgress));
          resolve();
        } else {
          reject(new Error('Invalid credentials. Try demo@example.com'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setProgress({});
    localStorage.removeItem('user');
    localStorage.removeItem('userProgress');
  };

  const register = async (name: string, email: string) => {
     return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = { id: Date.now().toString(), name, email };
        setUser(newUser);
        setProgress({});
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('userProgress', JSON.stringify({}));
        resolve();
      }, 500);
    });
  };

  const toggleLessonComplete = (courseId: string, lessonId: string) => {
    setProgress(prevProgress => {
      const courseProg = prevProgress[courseId] || { completedLessons: [] };
      const completedLessons = courseProg.completedLessons || [];
      const isCompleted = completedLessons.includes(lessonId);

      const newCompletedLessons = isCompleted
        ? completedLessons.filter(id => id !== lessonId)
        : [...completedLessons, lessonId];
      
      const newProgress = {
        ...prevProgress,
        [courseId]: {
          ...courseProg,
          completedLessons: newCompletedLessons
        }
      };

      localStorage.setItem('userProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };


  const value = { user, progress, loading, login, logout, register, toggleLessonComplete };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
