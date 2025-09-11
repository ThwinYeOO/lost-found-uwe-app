import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { getMessages, sendMessage } from '../services/firestore';
import { Message, User } from '../types';

interface ChatBoxProps {
  recipient: User;
  currentUser: User;
  open: boolean;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ recipient, currentUser, open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when chat opens
  useEffect(() => {
    if (open && recipient.id) {
      loadMessages();
    }
  }, [open, recipient.id]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [open, recipient.id]);

  const loadMessages = async () => {
    if (!recipient.id) return;

    try {
      setLoading(true);
      
      // Get messages between current user and recipient using the new chat endpoint
      const chatMessages = await getMessages(currentUser.id!, recipient.id);
      
      
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !recipient.id || sending) return;

    setSending(true);
    try {
      const messageData = {
        senderId: currentUser.id!,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        recipientId: recipient.id,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        subject: `Chat with ${recipient.name}`,
        content: newMessage.trim(),
      };

      await sendMessage(messageData);
      setNewMessage('');
      
      // Reload messages to show the new one
      setTimeout(() => {
        loadMessages();
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!open) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: 3,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              bgcolor: 'secondary.main',
            }}
          >
            {recipient.avatar ? (
              <img
                src={recipient.avatar}
                alt={recipient.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              recipient.name.charAt(0).toUpperCase()
            )}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {recipient.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {recipient.email}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          bgcolor: '#f5f5f5',
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUser.id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              const showTime = index === messages.length - 1 || 
                messages[index + 1].senderId !== message.senderId ||
                new Date(message.timestamp).getTime() - new Date(messages[index + 1].timestamp).getTime() > 300000; // 5 minutes
              
              
              return (
                <ListItem
                  key={message.id}
                  sx={{
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    p: 0.5,
                    px: 1,
                  }}
                >
                  {!isOwnMessage && showAvatar && (
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        mr: 1,
                        bgcolor: 'secondary.main',
                        fontSize: '0.75rem',
                      }}
                    >
                      {recipient.avatar ? (
                        <img
                          src={recipient.avatar}
                          alt={recipient.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        recipient.name.charAt(0).toUpperCase()
                      )}
                    </Avatar>
                  )}
                  {!isOwnMessage && !showAvatar && <Box sx={{ width: 36 }} />}
                  
                  <Box
                    sx={{
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                        color: isOwnMessage ? 'white' : 'text.primary',
                        borderRadius: isOwnMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        boxShadow: 1,
                        border: isOwnMessage ? 'none' : '1px solid',
                        borderColor: 'grey.300',
                      }}
                    >
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {message.content}
                      </Typography>
                    </Paper>
                    {showTime && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                          px: 1,
                        }}
                      >
                        {formatTime(message.timestamp)}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              );
            })}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            {sending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatBox;
