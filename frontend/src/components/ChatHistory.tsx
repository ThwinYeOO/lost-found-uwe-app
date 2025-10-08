import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Fade,
  Badge,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { getMessages, getUserById } from '../services/firestore';
import { Message, User } from '../types';
import ChatBox from './ChatBox';

interface ChatHistoryProps {
  open: boolean;
  onClose: () => void;
  currentUser: User;
  onConversationUpdate?: () => void;
  onOpenChat?: (user: User) => void;
}

interface ConversationSummary {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ open, onClose, currentUser, onConversationUpdate, onOpenChat }) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = useCallback(async () => {
    if (!currentUser.id) return;

    try {
      setLoading(true);
      // Get all messages for the current user
      const allMessages = await getMessages(currentUser.id);
      
      // Group messages by conversation partner
      const conversationMap = new Map<string, { partnerId: string; messages: Message[] }>();
      
      allMessages.forEach((message: Message) => {
        const partnerId = message.senderId === currentUser.id ? message.recipientId : message.senderId;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            partnerId,
            messages: []
          });
        }
        
        conversationMap.get(partnerId)!.messages.push(message);
      });
      
      // Fetch user data for each conversation partner
      const conversationSummaries: ConversationSummary[] = await Promise.all(
        Array.from(conversationMap.values()).map(async ({ partnerId, messages }) => {
          try {
            // Fetch the actual user data
            const user = await getUserById(partnerId);
            
            // Sort messages by timestamp
            const sortedMessages = messages.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            
            const lastMessage = sortedMessages[0];
            const unreadCount = sortedMessages.filter(msg => 
              msg.recipientId === currentUser.id && !msg.read
            ).length;
            
            return {
              user,
              lastMessage,
              unreadCount
            };
          } catch (error) {
            console.error(`Error fetching user data for ${partnerId}:`, error);
            // Fallback to message data if user fetch fails
            const message = messages[0];
            const fallbackUser: User = {
              id: partnerId,
              name: message.senderId === currentUser.id ? message.recipientName : message.senderName,
              email: message.senderId === currentUser.id ? message.recipientEmail : message.senderEmail,
              phoneNumber: '',
              uweId: '',
            };
            
            const sortedMessages = messages.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            
            const lastMessage = sortedMessages[0];
            const unreadCount = sortedMessages.filter(msg => 
              msg.recipientId === currentUser.id && !msg.read
            ).length;
            
            return {
              user: fallbackUser,
              lastMessage,
              unreadCount
            };
          }
        })
      );
      
      // Sort conversations by last message timestamp
      conversationSummaries.sort((a, b) => 
        new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
      );
      
      setConversations(conversationSummaries);
      setFilteredConversations(conversationSummaries);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conversation =>
        conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  useEffect(() => {
    if (open && currentUser.id) {
      loadConversations();
    }
  }, [open, currentUser.id, loadConversations]);

  const handleConversationClick = (user: User) => {
    setSelectedUser(user);
    setShowChatBox(true);
  };

  const handleCloseChatBox = () => {
    setShowChatBox(false);
    setSelectedUser(null);
    // Reload conversations to update unread counts
    loadConversations();
  };

  const handleMessagesRead = () => {
    // Refresh conversations when messages are marked as read
    loadConversations();
    if (onConversationUpdate) {
      onConversationUpdate();
    }
  };

  // Function to open chat with a specific user (for notifications)
  const openChatWithUser = (user: User) => {
    setSelectedUser(user);
    setShowChatBox(true);
    if (onOpenChat) {
      onOpenChat(user);
    }
  };

  // Expose the function to parent components
  React.useEffect(() => {
    if (onOpenChat) {
      // This allows the parent to call openChatWithUser
      (window as any).openChatWithUser = openChatWithUser;
    }
  }, [onOpenChat]);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return messageTime.toLocaleDateString([], { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return messageTime.toLocaleDateString([], { 
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const truncateMessage = (content: string, maxLength: number = 60) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusColor = (unreadCount: number) => {
    if (unreadCount > 0) return 'primary.main';
    return 'text.secondary';
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-4px); }
            60% { transform: translateY(-2px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            height: { xs: '90vh', sm: '80vh' },
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            mx: { xs: 1, sm: 0 },
            my: { xs: 1, sm: 0 },
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 3,
          px: 3,
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
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
              borderRadius: 2, 
              p: 1, 
              mr: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <MessageIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
                Chat History
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                Connect with other users
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                  }
                }
              }}
            />
          </Box>
          {/* Content Area */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ p: 3 }}>
                {[...Array(3)].map((_, index) => (
                  <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="60%" height={24} />
                          <Skeleton variant="text" width="40%" height={20} />
                          <Skeleton variant="text" width="80%" height={16} />
                        </Box>
                        <Skeleton variant="text" width={60} height={20} />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : filteredConversations.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                <Box sx={{ 
                  bgcolor: 'grey.100', 
                  borderRadius: '50%', 
                  p: 3, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start chatting with other users about lost and found items'
                  }
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {filteredConversations.map((conversation, index) => (
                <Fade in={true} timeout={300 + index * 100} key={conversation.user.id}>
                  <Card 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 4,
                      background: conversation.unreadCount > 0 
                        ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.03) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: conversation.unreadCount > 0 
                        ? '0 12px 40px rgba(25, 118, 210, 0.15), 0 0 0 1px rgba(25, 118, 210, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 8px 30px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      border: '1px solid',
                      borderColor: conversation.unreadCount > 0 ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: conversation.unreadCount > 0 
                          ? '0 20px 60px rgba(25, 118, 210, 0.25), 0 0 0 1px rgba(25, 118, 210, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          : '0 16px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-8px) scale(1.02)',
                        borderColor: 'primary.main',
                      },
                      '&:active': {
                        transform: 'translateY(-4px) scale(1.01)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: conversation.unreadCount > 0 
                          ? 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)'
                          : 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.4), transparent)',
                        opacity: conversation.unreadCount > 0 ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::after': {
                        opacity: 1,
                      },
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: 0,
                        '&:last-child': { pb: 0 }
                      }}
                    >
                      <Box
                        onClick={() => handleConversationClick(conversation.user)}
                        sx={{
                          py: { xs: 2, sm: 3 },
                          px: { xs: 3, sm: 4 },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {/* Enhanced Avatar with Status */}
                        <Box sx={{ position: 'relative' }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  background: conversation.unreadCount > 0 
                                    ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                                    : 'linear-gradient(135deg, #9e9e9e 0%, #616161 100%)',
                                  border: '3px solid white',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: 'white',
                                    animation: conversation.unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                                  }}
                                />
                              </Box>
                            }
                          >
                            <Avatar
                              sx={{
                                width: { xs: 56, sm: 64 },
                                height: { xs: 56, sm: 64 },
                                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                fontWeight: 'bold',
                                background: conversation.user.avatar 
                                  ? 'none'
                                  : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15), 0 0 0 3px rgba(255,255,255,0.8)',
                                border: '2px solid rgba(255,255,255,0.9)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {conversation.user.avatar ? (
                                <img
                                  src={conversation.user.avatar}
                                  alt={conversation.user.name}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                  }}
                                />
                              ) : (
                                getInitials(conversation.user.name)
                              )}
                            </Avatar>
                          </Badge>
                        </Box>
                        
                        {/* Enhanced Content Area */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Header Row */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            mb: 1.5 
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                              <Typography 
                                variant="h6" 
                                fontWeight={conversation.unreadCount > 0 ? 800 : 700}
                                color={conversation.unreadCount > 0 ? 'primary.main' : 'text.primary'}
                                sx={{ 
                                  fontSize: { xs: '1rem', sm: '1.1rem' },
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {conversation.user.name}
                              </Typography>
                              {conversation.unreadCount > 0 && (
                                <Box
                                  sx={{
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    minWidth: 28,
                                    height: 28,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                    animation: 'bounce 1s infinite',
                                  }}
                                >
                                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                                </Box>
                              )}
                            </Box>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                ml: 2
                              }}
                            >
                              {formatTime(conversation.lastMessage.timestamp)}
                            </Typography>
                          </Box>

                          {/* Message Preview */}
                          <Box sx={{ mb: 1.5 }}>
                            <Typography
                              variant="body2"
                              color={conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                                lineHeight: 1.5,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              {conversation.lastMessage.senderId === currentUser.id ? (
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main', 
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    border: '1px solid rgba(25, 118, 210, 0.2)',
                                  }}
                                >
                                  You
                                </Box>
                              ) : (
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {conversation.user.name.split(' ')[0]}
                                </Box>
                              )}
                              <Box component="span" sx={{ color: 'text.secondary', mx: 0.5 }}>•</Box>
                              {truncateMessage(conversation.lastMessage.content, 50)}
                            </Typography>
                          </Box>

                          {/* Email and Status Row */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            gap: 2
                          }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              flex: 1,
                              minWidth: 0
                            }}>
                              <EmailIcon sx={{ 
                                fontSize: 14, 
                                color: 'text.secondary',
                                opacity: 0.7
                              }} />
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  fontSize: '0.8rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {conversation.user.email}
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1 
                            }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: conversation.unreadCount > 0 
                                    ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                                    : 'linear-gradient(135deg, #9e9e9e 0%, #616161 100%)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                              />
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                }}
                              >
                                {conversation.unreadCount > 0 ? 'Active' : 'Offline'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Box>
          )}
          </Box>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <ChatBox
          recipient={selectedUser}
          currentUser={currentUser}
          open={showChatBox}
          onClose={handleCloseChatBox}
          onMessagesRead={handleMessagesRead}
        />
      )}
    </>
  );
};

export default ChatHistory;
