// src/context/AuthContext.js
// Guarda el usuario logueado (con su perfil del backend) y lo comparte con toda la app.
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthChange, getProfile, logout } from '../services/authService';
import { ROLES } from '../models/User';
import { auth } from '../config/firebase';

const AuthContext = createContext({ user: null, loading: true, isAdmin: false, refresh: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    try {
      const profile = await getProfile();
      setUser({ uid: firebaseUser.uid, ...profile });
    } catch (e) {
      if (e.status === 403 || e.status === 401) {
        // Usuario desactivado o sesión inválida
        await logout();
        setUser(null);
      } else {
        // Backend apagado: se mantiene la sesión con los datos básicos
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || '' });
      }
    }
  }, []);

  useEffect(() => {
    const stop = onAuthChange(async (firebaseUser) => {
      await loadProfile(firebaseUser);
      setLoading(false);
    });
    return stop;
  }, [loadProfile]);

  const refresh = useCallback(async () => {
    await loadProfile(auth.currentUser);
  }, [loadProfile]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === ROLES[0], refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook: const { user, loading, isAdmin } = useAuth(); */
export const useAuth = () => useContext(AuthContext);
