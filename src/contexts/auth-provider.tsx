
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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '@/lib/firebase';
import type { User } from '@/lib/types';


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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        let isUserAdmin = false;
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.role === 'admin') {
                isUserAdmin = true;
            }
        }

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
    const newUser = userCredential.user;
    if (newUser) {
        await updateProfile(newUser, { displayName: name });
        
        // Create user document in Firestore
        const userDocRef = doc(db, "users", newUser.uid);
        await setDoc(userDocRef, {
            'e-mail': email,
            role: 'user' // Default role for new users
        });

        setUser({
          id: newUser.uid,
          name: name,
          email: email,
          isAdmin: false, // New users are not admins by default
        });
        setIsAdmin(false);
    }
  };

  const value = { user, loading, isAdmin, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
