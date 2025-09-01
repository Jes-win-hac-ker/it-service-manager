// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';


interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'client';
  display_name?: string;
}


interface AuthContextType {
  user: UserWithRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>; 
  signIn: (email: string, password: string) => Promise<{ error: any }>; 
  signOut: () => Promise<{ error: any }>; 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
});


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser?.email) {
        // ✅ Determine role using authService
        const role = authService.getUserRole(currentUser.email);
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          role,
          display_name: currentUser.user_metadata?.display_name,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();

    // ✅ Keep session in sync
    const { data: subscription } = authService.onAuthStateChange(() => {
      initAuth();
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  // Add signUp and signIn to context
  const signUp = async (email: string, password: string, username: string) => {
    return await authService.signUp(email, password, username);
  };
  const signIn = async (email: string, password: string) => {
    return await authService.signIn(email, password);
  };

  const signOut = async () => {
    return await authService.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
