import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setTenantId } from '../api/client';

type Role = 'admin' | 'subscriber' | null;

interface User {
  id: string; // The user's ID
  role: Role;
  organizationId: string; // The tenant they belong to
}

interface AuthContextType {
  user: User | null;
  loginAsAdmin: (organizationId: string) => void;
  loginAsSubscriber: (userId: string, organizationId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Apply tenant ID globally to axios when user changes
  useEffect(() => {
    if (user?.organizationId) {
      setTenantId(user.organizationId);
    } else {
      setTenantId(null);
    }
  }, [user]);

  const loginAsAdmin = (organizationId: string) => {
    setUser({ id: 'admin-1', role: 'admin', organizationId });
  };

  const loginAsSubscriber = (userId: string, organizationId: string) => {
    setUser({ id: userId, role: 'subscriber', organizationId });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginAsAdmin, loginAsSubscriber, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
