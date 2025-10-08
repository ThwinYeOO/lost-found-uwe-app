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
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  Popover,
  Grid,
  Snackbar,
  Alert,
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
  Person as PersonIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { getMessages, sendMessage, markMessagesAsRead, updateMessageStatus } from '../services/firestore';
import { Message, User } from '../types';

interface ChatBoxProps {
  recipient: User;
  currentUser: User;
  open: boolean;
  onClose: () => void;
  onMessagesRead?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ recipient, currentUser, open, onClose, onMessagesRead }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
      const allMessages = await getMessages(currentUser.id!, recipient.id);
      
      // Filter out email messages, only show chat messages
      const chatMessages = allMessages.filter(message => 
        message.messageType !== 'email' || !message.messageType
      );
      
      setMessages(chatMessages);
      
      // Mark messages as read and seen when chat opens
      if (open && chatMessages.length > 0) {
        try {
          await markMessagesAsRead(currentUser.id!, recipient.id);
          
          // Update all received messages to "seen" status
          const receivedMessages = chatMessages.filter(msg => 
            msg.recipientId === currentUser.id && msg.status !== 'seen'
          );
          
          for (const message of receivedMessages) {
            if (message.id) {
              try {
                await updateMessageStatus(message.id, 'seen');
              } catch (error) {
                console.error(`Error updating message ${message.id} status:`, error);
              }
            }
          }
          
          // Notify parent component to refresh conversation list
          if (onMessagesRead) {
            onMessagesRead();
          }
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !recipient.id || sending) return;

    let messageContent = newMessage.trim();
    let attachmentData = null;

    // Handle file attachment
    if (selectedFile) {
      try {
        const base64Data = await convertFileToBase64(selectedFile);
        attachmentData = {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          data: base64Data,
        };
        
        // If no text message, add a default message
        if (!messageContent) {
          messageContent = `📎 ${selectedFile.name}`;
        }
      } catch (error) {
        console.error('Error converting file to base64:', error);
        setSnackbarMessage('Error processing file. Please try again.');
        setSnackbarOpen(true);
        return;
      }
    }

    setNewMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      messageType: 'chat', // Mark as chat message
      attachment: attachmentData || undefined,
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
        messageType: 'chat' as const, // Mark as chat message
        attachment: attachmentData || undefined,
      };

      await sendMessage(messageData);
      
      // Update message status to delivered (since we got response from server)
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, status: 'delivered' as const, deliveredAt: new Date() }
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
      setSnackbarMessage('Error sending message. Please try again.');
      setSnackbarOpen(true);
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
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          </Box>
        );
      case 'delivered':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DoneAllIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          </Box>
        );
      case 'seen':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DoneAllIcon sx={{ fontSize: 12, color: '#4caf50' }} />
          </Box>
        );
      default:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          </Box>
        );
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleViewProfile = () => {
    setShowProfile(true);
    handleMenuClose();
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  // Emoji picker functions
  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    handleEmojiClose();
  };

  // File handling functions
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setSnackbarMessage('File size too large. Maximum size is 10MB.');
        setSnackbarOpen(true);
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setSnackbarMessage('File type not supported. Please select an image, PDF, or text file.');
        setSnackbarOpen(true);
        return;
      }
      
      setSelectedFile(file);
      setSnackbarMessage(`File selected: ${file.name}`);
      setSnackbarOpen(true);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Touch handlers for swipe to close - only on header area
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only track touch on the header area, not the entire chat
    const target = e.target as HTMLElement;
    if (!target.closest('.chat-header-area')) {
      return; // Only track touch events in header area
    }
    
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only track touch on the header area
    const target = e.target as HTMLElement;
    if (!target.closest('.chat-header-area')) {
      return; // Only track touch events in header area
    }
    
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 120; // Increased threshold for swipe
    
    // Only close on very deliberate swipe up from header area
    if (isUpSwipe && distance > 120) {
      onClose();
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if (!open) return null;

  return (
    <Slide direction="up" in={open} timeout={300}>
      <Paper
        sx={{
          position: 'fixed',
          bottom: { xs: 0, sm: 20 },
          right: { xs: 0, sm: 20 },
          left: { xs: 0, sm: 'auto' },
          top: { xs: 0, sm: 'auto' },
          width: { xs: '100vw', sm: 420 },
          height: { xs: 'calc(100vh - env(safe-area-inset-bottom) - 60px)', sm: 600 },
          maxHeight: { xs: 'calc(100vh - env(safe-area-inset-bottom) - 60px)', sm: 600 },
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: { xs: 'none', sm: '0 8px 32px rgba(0,0,0,0.12)' },
          borderRadius: { xs: 0, sm: 3 },
          overflow: 'hidden',
          // Ensure proper mobile layout with safe area
          '@media (max-width: 600px)': {
            height: 'calc(100vh - env(safe-area-inset-bottom) - 60px)',
            maxHeight: 'calc(100vh - env(safe-area-inset-bottom) - 60px)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // Account for Chrome UI
            paddingBottom: 'env(safe-area-inset-bottom)',
          },
        }}
      >
      {/* Mobile Swipe Handle */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'center',
          alignItems: 'center',
          py: 1,
          bgcolor: 'rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            bgcolor: 'rgba(255,255,255,0.5)',
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Chat Header */}
      <Box
        className="chat-header-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        sx={{
          p: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 3 },
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 60, sm: 80 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'shimmer 4s ease-in-out infinite',
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
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
            <IconButton 
              size="small" 
              onClick={handleMenuClick}
              sx={{ 
                color: 'white', 
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close chat">
            <Box
              onClick={onClose}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                px: { xs: 1, sm: 0.5 },
                py: { xs: 0.5, sm: 0 },
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                '&:active': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              <IconButton 
                size="medium"
                sx={{ 
                  color: 'white',
                  minWidth: { xs: 48, sm: 40 },
                  minHeight: { xs: 48, sm: 40 },
                  fontSize: { xs: '1.2rem', sm: '1rem' },
                  p: 0,
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Close
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        className="chat-messages-area"
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 1, sm: 1 },
          background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
          minHeight: 0, // Important for flexbox
          maxHeight: { xs: 'calc(100vh - 250px)', sm: 'calc(100% - 120px)' }, // Reserve much more space for header and input on mobile
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
                        
                        {/* Attachment Display */}
                        {message.attachment && (
                          <Box sx={{ mt: 1 }}>
                            {message.attachment.fileType.startsWith('image/') ? (
                              <Box sx={{ 
                                maxWidth: 200, 
                                maxHeight: 200, 
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.2)',
                              }}>
                                <img
                                  src={message.attachment.data}
                                  alt={message.attachment.fileName}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                  }}
                                />
                              </Box>
                            ) : (
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 1,
                                border: '1px solid rgba(255,255,255,0.2)',
                              }}>
                                <Typography variant="caption" sx={{ fontSize: '1.2rem' }}>
                                  📎
                                </Typography>
                                <Box>
                                  <Typography variant="caption" sx={{ 
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    opacity: 0.9,
                                  }}>
                                    {message.attachment.fileName}
                                  </Typography>
                                  <Typography variant="caption" sx={{ 
                                    fontSize: '0.7rem',
                                    opacity: 0.7,
                                  }}>
                                    {(message.attachment.fileSize / 1024).toFixed(1)} KB
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
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
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  ml: 0.5,
                                  opacity: message.status === 'sending' ? 0.6 : 1,
                                  transition: 'opacity 0.2s ease'
                                }}
                              >
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
        className="mobile-chat-input chat-input-area"
        sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          pb: { xs: 'calc(1.5rem + env(safe-area-inset-bottom))', sm: 2 }, // Extra padding for mobile browsers
          borderTop: 1, 
          borderColor: 'divider',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          minHeight: { xs: 100, sm: 70 },
          flexShrink: 0, // Prevent shrinking
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          // Ensure input is above browser UI
          '@media (max-width: 600px)': {
            paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom) + 20px)', // Extra space for Chrome UI
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 }, 
          alignItems: 'flex-end',
          width: '100%',
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.25, sm: 0.5 }, 
            mb: { xs: 0.5, sm: 1 },
            flexShrink: 0, // Prevent shrinking
          }}>
            <Tooltip title="Attach file">
              <IconButton 
                size="small" 
                onClick={handleFileClick}
                sx={{ 
                  color: 'text.secondary',
                  minWidth: { xs: 40, sm: 32 },
                  minHeight: { xs: 40, sm: 32 },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'primary.50',
                  }
                }}
              >
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add emoji">
              <IconButton 
                size="small" 
                onClick={handleEmojiClick}
                sx={{ 
                  color: 'text.secondary',
                  minWidth: { xs: 40, sm: 32 },
                  minHeight: { xs: 40, sm: 32 },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'primary.50',
                  }
                }}
              >
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
                minHeight: { xs: 56, sm: 40 }, // Even larger on mobile
                fontSize: { xs: '16px', sm: '14px' }, // Prevent zoom on iOS
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                },
              },
              '& .MuiInputBase-input': {
                padding: { xs: '16px 14px', sm: '8px 14px' }, // Even more padding on mobile
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            sx={{ 
              minWidth: { xs: 48, sm: 'auto' }, 
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: { xs: 48, sm: 40 }, // Larger on mobile
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0px)',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              },
              '&:disabled': {
                background: 'grey.300',
                boxShadow: 'none',
                transform: 'none',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::before': {
                left: '100%',
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

      {/* More Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.08)',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleViewProfile} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="View Profile" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Chat Info" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </MenuItem>
      </Menu>

      {/* Profile Dialog */}
      {showProfile && (
        <Dialog
          open={showProfile}
          onClose={handleCloseProfile}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            textAlign: 'center',
            py: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'shimmer 3s ease-in-out infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  border: '4px solid rgba(255,255,255,0.9)',
                }}
              >
                {recipient.avatar ? (
                  <img
                    src={recipient.avatar}
                    alt={recipient.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  recipient.name?.charAt(0).toUpperCase() || 'U'
                )}
              </Avatar>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                {recipient.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {recipient.email}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom color="primary">
                {recipient.name}'s Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                View {recipient.name}'s profile information
              </Typography>
              
              <Box sx={{ 
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
                borderRadius: 2,
                p: 3,
                border: '1px solid rgba(25, 118, 210, 0.1)',
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  UWE ID
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>
                  {recipient.uweId || 'Not provided'}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>
                  {recipient.email}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Account Status
                </Typography>
                <Chip 
                  label="Active" 
                  color="success" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,application/pdf,.txt"
      />

      {/* Emoji Picker */}
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={handleEmojiClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            maxWidth: 300,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Choose an emoji
        </Typography>
        <Grid container spacing={1}>
          {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'].map((emoji) => (
            <Grid item key={emoji}>
              <IconButton
                size="small"
                onClick={() => handleEmojiSelect(emoji)}
                sx={{
                  fontSize: '1.5rem',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    transform: 'scale(1.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {emoji}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </Popover>

      {/* File Preview */}
      {selectedFile && (
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleRemoveFile}
            sx={{ color: 'error.main' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="info" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
    </Slide>
  );
};

export default ChatBox;

