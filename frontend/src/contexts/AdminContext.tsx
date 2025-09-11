import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AdminContextType {
  adminUser: User | null;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      // Check for stored admin user in localStorage
      const storedAdmin = localStorage.getItem('adminUser');
      const storedUser = localStorage.getItem('user');
      
      if (storedAdmin) {
        try {
          const user = JSON.parse(storedAdmin);
          if (user.role === 'admin') {
            setAdminUser(user);
          } else {
            setAdminUser(null);
            localStorage.removeItem('adminUser');
          }
        } catch (error) {
          console.error('Error parsing stored admin user:', error);
          localStorage.removeItem('adminUser');
          setAdminUser(null);
        }
      } else if (storedUser) {
        // Check if current user is admin
        try {
          const user = JSON.parse(storedUser);
          if (user.role === 'admin') {
            setAdminUser(user);
          } else {
            setAdminUser(null);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
    };

    checkAdminStatus();
    setLoading(false);

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'adminUser') {
        checkAdminStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (user: User) => {
    if (user.role === 'admin') {
      setAdminUser(user);
      localStorage.setItem('adminUser', JSON.stringify(user));
    } else {
      // Clear admin context if non-admin user logs in
      setAdminUser(null);
      localStorage.removeItem('adminUser');
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const isAdmin = adminUser?.role === 'admin';

  const value: AdminContextType = {
    adminUser,
    isAdmin,
    login,
    logout,
    loading,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
