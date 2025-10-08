import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNotifications } from '../contexts/NotificationContext';
import { Message } from '../types';
import NotificationPopup from './NotificationPopup';

interface NotificationManagerProps {
  onViewMessage: (message: Message) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ onViewMessage }) => {
  const { notifications, removeNotification } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<Set<string>>(new Set());

  const handleClose = (messageId: string | undefined) => {
    if (messageId) {
      removeNotification(messageId);
      setVisibleNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const handleViewMessage = (message: Message) => {
    onViewMessage(message);
    handleClose(message.id);
  };

  // Show new notifications
  React.useEffect(() => {
    notifications.forEach(notification => {
      if (notification.id && !visibleNotifications.has(notification.id)) {
        setVisibleNotifications(prev => new Set(prev).add(notification.id!));
      }
    });
  }, [notifications, visibleNotifications]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: '400px',
        pointerEvents: 'none',
      }}
    >
      {notifications
        .filter(notification => notification.id && visibleNotifications.has(notification.id))
        .map((notification, index) => (
          <Box
            key={notification.id}
            sx={{
              pointerEvents: 'auto',
              transform: `translateY(${index * 10}px)`,
              transition: 'transform 0.3s ease',
            }}
          >
            <NotificationPopup
              message={notification}
              onClose={() => handleClose(notification.id)}
              onViewMessage={handleViewMessage}
            />
          </Box>
        ))}
    </Box>
  );
};

export default NotificationManager;
