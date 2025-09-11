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
} from '@mui/material';
import {
  Close as CloseIcon,
  Message as MessageIcon,
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
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showChatBox, setShowChatBox] = useState(false);

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
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

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

  const truncateMessage = (content: string, maxLength: number = 50) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { height: '70vh' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MessageIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Chat History</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : conversations.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <MessageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No conversations yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start chatting with other users about lost and found items
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {conversations.map((conversation, index) => (
                <React.Fragment key={conversation.user.id}>
                  <ListItem
                    button
                    onClick={() => handleConversationClick(conversation.user)}
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: 'secondary.main',
                          width: 48,
                          height: 48,
                        }}
                      >
                        {conversation.user.avatar ? (
                          <img
                            src={conversation.user.avatar}
                            alt={conversation.user.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          conversation.user.name.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {conversation.user.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {conversation.unreadCount > 0 && (
                              <Chip
                                label={conversation.unreadCount}
                                size="small"
                                color="primary"
                                sx={{ minWidth: 20, height: 20, fontSize: '0.75rem' }}
                              />
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                            }}
                          >
                            {conversation.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                            {truncateMessage(conversation.lastMessage.content)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.user.email}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < conversations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
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
