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
}

interface ConversationSummary {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ open, onClose, currentUser }) => {
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
          bgcolor: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 2,
          px: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              borderRadius: 1, 
              p: 0.5, 
              mr: 1.5 
            }}>
              <MessageIcon />
            </Box>
            <Typography variant="h5" fontWeight="600">
              Chat History
            </Typography>
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
              <List sx={{ p: 0 }}>
                {filteredConversations.map((conversation, index) => (
                <Fade in={true} timeout={300 + index * 100} key={conversation.user.id}>
                  <Card 
                    sx={{ 
                      mx: { xs: 1, sm: 2 }, 
                      mb: 1, 
                      borderRadius: 2,
                      boxShadow: conversation.unreadCount > 0 ? 2 : 1,
                      border: conversation.unreadCount > 0 ? '1px solid' : 'none',
                      borderColor: conversation.unreadCount > 0 ? 'primary.main' : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-1px)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: 0,
                        '&:last-child': { pb: 0 }
                      }}
                    >
                      <ListItem
                        button
                        onClick={() => handleConversationClick(conversation.user)}
                        sx={{
                          py: { xs: 1.5, sm: 2 },
                          px: { xs: 2, sm: 3 },
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'transparent',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              conversation.unreadCount > 0 ? (
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    border: '2px solid white',
                                  }}
                                />
                              ) : null
                            }
                          >
                            <Avatar
                              sx={{
                                bgcolor: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                width: { xs: 44, sm: 52 },
                                height: { xs: 44, sm: 52 },
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 'bold',
                                boxShadow: 2,
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
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography 
                                variant="subtitle1" 
                                fontWeight={conversation.unreadCount > 0 ? 700 : 600}
                                color={conversation.unreadCount > 0 ? 'primary.main' : 'text.primary'}
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  fontSize: { xs: '0.9rem', sm: '1rem' }
                                }}
                              >
                                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                {conversation.user.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {conversation.unreadCount > 0 && (
                                  <Chip
                                    label={conversation.unreadCount}
                                    size="small"
                                    color="primary"
                                    sx={{ 
                                      minWidth: 24, 
                                      height: 24, 
                                      fontSize: '0.7rem',
                                      fontWeight: 'bold',
                                      '& .MuiChip-label': {
                                        px: 1
                                      }
                                    }}
                                  />
                                )}
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 0.5,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  <TimeIcon sx={{ fontSize: 12 }} />
                                  {formatTime(conversation.lastMessage.timestamp)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color={conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                                  mb: 0.5,
                                  lineHeight: 1.4,
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                }}
                              >
                                {conversation.lastMessage.senderId === currentUser.id ? (
                                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                    You: 
                                  </Box>
                                ) : null}
                                {conversation.lastMessage.senderId === currentUser.id ? ' ' : ''}
                                {truncateMessage(conversation.lastMessage.content)}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 0.5,
                                  fontSize: '0.7rem'
                                }}
                              >
                                <EmailIcon sx={{ fontSize: 12 }} />
                                {conversation.user.email}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </List>
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
        />
      )}
    </>
  );
};

export default ChatHistory;
