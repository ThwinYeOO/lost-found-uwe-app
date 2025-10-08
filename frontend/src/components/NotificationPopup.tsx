import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
  IconButton,
  Slide,
  SlideProps,
  Paper,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Message, User } from '../types';
import { getUserById } from '../services/firestore';

interface NotificationPopupProps {
  message: Message;
  onClose: () => void;
  onViewMessage: (message: Message) => void;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  message,
  onClose,
  onViewMessage,
}) => {
  const [sender, setSender] = useState<User | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const fetchSender = async () => {
      try {
        const senderData = await getUserById(message.senderId);
        setSender(senderData);
      } catch (error) {
        console.error('Error fetching sender:', error);
      }
    };

    fetchSender();
  }, [message.senderId]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleViewMessage = () => {
    onViewMessage(message);
    handleClose();
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageTime.toLocaleDateString();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0,
          minWidth: '320px',
          maxWidth: '400px',
        },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          },
        }}
        onClick={handleViewMessage}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={sender?.avatar}
              sx={{
                width: 48,
                height: 48,
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {sender?.name?.charAt(0) || <PersonIcon />}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#4caf50',
                border: '2px solid white',
                animation: 'pulse 2s infinite',
              }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {sender?.name || 'Unknown User'}
              </Typography>
              <Chip
                label="New Message"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.85rem',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 1,
              }}
            >
              {message.content}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.75rem',
                }}
              >
                {formatTime(message.timestamp)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MessageIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.75rem',
                  }}
                >
                  Click to view
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Close Button */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              '&:hover': {
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* CSS Animation */}
        <style>
          {`
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.7;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}
        </style>
      </Paper>
    </Snackbar>
  );
};

export default NotificationPopup;
