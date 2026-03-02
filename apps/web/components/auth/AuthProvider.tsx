"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateUserProfile as reduxUpdateUserProfile } from "@/store/slices/userSlice";
import { RootState } from "@/store";
import api from "@/lib/api";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  gender?: string;
  dob?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (email?: string, name?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('finease_token');
      if (token) {
        try {
          const res = await api.get('/finance/profile');
          const userData = res.data;
          dispatch(setUser({
            uid: userData.id || userData.uid,
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.displayName || 'User')}`,
            gender: userData.gender,
            dob: userData.dob,
          }));
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('finease_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  const loginWithGoogle = async (email?: string, name?: string, password?: string) => {
    try {
      // Special logic: if name is provided, it's a signup, else login
      const endpoint = name ? '/auth/signup' : '/auth/login';
      const payload = name 
        ? { email, name, password: password || 'password123' }
        : { email, password: password || 'password123' };

      const res = await api.post(endpoint, payload);
      const { user: userData, token } = res.data;
      
      localStorage.setItem('finease_token', token);
      
      dispatch(setUser({
        uid: userData.id || userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.displayName || 'User')}`,
        gender: userData.gender,
        dob: userData.dob,
      }));
    } catch (error: any) {
      console.error('Auth error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('finease_token');
    dispatch(setUser(null));
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      await api.put('/finance/profile', updates);
      dispatch(reduxUpdateUserProfile(updates));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
