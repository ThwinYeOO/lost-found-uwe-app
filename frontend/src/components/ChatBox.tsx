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
  Fade,
  Slide,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
  Visibility as SeenIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Add optimistic message with sending status
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      senderId: currentUser.id!,
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      subject: `Chat with ${recipient.name}`,
      content: messageContent,
      timestamp: new Date(),
      read: false,
      status: 'sending',
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const messageData = {
        senderId: currentUser.id!,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        recipientId: recipient.id,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        subject: `Chat with ${recipient.name}`,
        content: messageContent,
        status: 'sending' as const,
      };

      await sendMessage(messageData);
      
      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, status: 'sent' as const }
          : msg
      ));
      
      // Reload messages to get the actual message with proper ID
      setTimeout(() => {
        loadMessages();
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
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

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <CircularProgress size={12} color="inherit" />;
      case 'sent':
        return <CheckIcon sx={{ fontSize: 12, color: 'text.secondary' }} />;
      case 'delivered':
        return <DoneAllIcon sx={{ fontSize: 12, color: 'text.secondary' }} />;
      case 'seen':
        return <DoneAllIcon sx={{ fontSize: 12, color: 'primary.main' }} />;
      default:
        return <CheckIcon sx={{ fontSize: 12, color: 'text.secondary' }} />;
    }
  };

  const getMessageStatusTooltip = (status: string, deliveredAt?: Date, seenAt?: Date) => {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'sent':
        return 'Sent';
      case 'delivered':
        return `Delivered${deliveredAt ? ` at ${formatTime(deliveredAt)}` : ''}`;
      case 'seen':
        return `Seen${seenAt ? ` at ${formatTime(seenAt)}` : ''}`;
      default:
        return 'Sent';
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  if (!open) return null;

  return (
    <Slide direction="up" in={open} timeout={300}>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: { xs: 'calc(100vw - 40px)', sm: 420 },
          height: { xs: 'calc(100vh - 40px)', sm: 600 },
          maxHeight: { xs: 'calc(100vh - 40px)', sm: 600 },
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#4caf50',
                  border: '2px solid white',
                }}
              />
            }
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {recipient.avatar ? (
                <img
                  src={recipient.avatar}
                  alt={recipient.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                recipient.name.charAt(0).toUpperCase()
              )}
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ fontSize: '1rem' }}>
              {recipient.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              {isTyping ? 'typing...' : 'online'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="More options">
            <IconButton size="small" sx={{ color: 'white', opacity: 0.8 }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close chat">
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.3)',
          },
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
                <Fade in={true} timeout={300} key={message.id}>
                  <ListItem
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
                          width: 32,
                          height: 32,
                          mr: 1,
                          bgcolor: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          boxShadow: 2,
                        }}
                      >
                        {recipient.avatar ? (
                          <img
                            src={recipient.avatar}
                            alt={recipient.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          />
                        ) : (
                          recipient.name.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                    )}
                    {!isOwnMessage && !showAvatar && <Box sx={{ width: 40 }} />}
                    
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
                          background: isOwnMessage 
                            ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' 
                            : 'white',
                          color: isOwnMessage ? 'white' : 'text.primary',
                          borderRadius: isOwnMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          boxShadow: isOwnMessage 
                            ? '0 2px 8px rgba(25, 118, 210, 0.3)' 
                            : '0 2px 8px rgba(0,0,0,0.1)',
                          border: isOwnMessage ? 'none' : '1px solid',
                          borderColor: 'grey.200',
                          position: 'relative',
                          '&:hover': {
                            boxShadow: isOwnMessage 
                              ? '0 4px 12px rgba(25, 118, 210, 0.4)' 
                              : '0 4px 12px rgba(0,0,0,0.15)',
                          },
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                            fontSize: '0.9rem',
                          }}
                        >
                          {message.content}
                        </Typography>
                      </Paper>
                      
                      {showTime && (
                        <Box
                          sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.7rem',
                            }}
                          >
                            {formatTime(message.timestamp)}
                          </Typography>
                          {isOwnMessage && (
                            <Tooltip title={getMessageStatusTooltip(message.status, message.deliveredAt, message.seenAt)}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getMessageStatusIcon(message.status)}
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                </Fade>
              );
            })}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Message Input */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            <Tooltip title="Attach file">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add emoji">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <EmojiIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            disabled={sending}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            sx={{ 
              minWidth: 'auto', 
              px: 2,
              py: 1,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              },
              '&:disabled': {
                background: 'grey.300',
                boxShadow: 'none',
              },
            }}
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
    </Slide>
  );
};

export default ChatBox;

