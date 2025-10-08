import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMessages } from '../services/firestore';
import { Message, User } from '../types';

interface NotificationContextType {
  notifications: Message[];
  addNotification: (message: Message) => void;
  removeNotification: (messageId: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  currentUser: User | null;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  currentUser 
}) => {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const addNotification = (message: Message) => {
    setNotifications(prev => [...prev, message]);
  };

  const removeNotification = (messageId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== messageId));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Check for new messages every 5 seconds
  useEffect(() => {
    if (!currentUser?.id) return;

    const checkForNewMessages = async () => {
      try {
        const allMessages = await getMessages(currentUser.id!);
        
        // Filter for new messages received by current user
        const newMessages = allMessages.filter(message => 
          message.recipientId === currentUser.id && 
          new Date(message.timestamp) > lastChecked &&
          !message.read
        );

        // Add new messages as notifications
        newMessages.forEach(message => {
          addNotification(message);
        });

        setLastChecked(new Date());
      } catch (error) {
        console.error('Error checking for new messages:', error);
      }
    };

    const interval = setInterval(checkForNewMessages, 5000);
    
    return () => clearInterval(interval);
  }, [currentUser?.id, lastChecked]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
