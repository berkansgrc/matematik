"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  type User as FirebaseUser
} from "firebase/auth";
import { auth } from '@/lib/firebase';
import type { User } from '@/lib/types';

// IMPORTANT: Replace this with your actual admin's email address.
const ADMIN_EMAIL = "admin@example.com";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const isUserAdmin = firebaseUser.email === ADMIN_EMAIL;
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Kullanıcı',
          email: firebaseUser.email || '',
          isAdmin: isUserAdmin,
        });
        setIsAdmin(isUserAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) {
      throw new Error("Şifre gereklidir.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = async (name: string, email: string, password?: string) => {
    if (!password) {
      throw new Error("Şifre gereklidir.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        const isUserAdmin = userCredential.user.email === ADMIN_EMAIL;
         setUser({
          id: userCredential.user.uid,
          name: name,
          email: email,
          isAdmin: isUserAdmin,
        });
        setIsAdmin(isUserAdmin);
    }
  };

  const value = { user, loading, isAdmin, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
