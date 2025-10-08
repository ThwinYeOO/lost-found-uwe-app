import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Item, User, Message } from '../types';
import { API_CONFIG } from '../config/api';

// Collection references
const ITEMS_COLLECTION = 'items';
const USERS_COLLECTION = 'users';
const MESSAGES_COLLECTION = 'messages';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Items Operations
export const addItem = async (item: Omit<Item, 'id'>) => {
  try {
    console.log('=== ADD ITEM DEBUG ===');
    console.log('API URL:', `${API_BASE_URL}/api/items`);
    console.log('Item data being sent:', item);
    console.log('Image URL in item:', item.imageUrl ? 'Present' : 'Missing');
    
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error response:', error);
      throw new Error(error.details || 'Failed to add item');
    }

    const data = await response.json();
    console.log('Item added successfully, ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const getItems = async (type: 'Lost' | 'Found'): Promise<Item[]> => {
  try {
        const url = `${API_BASE_URL}/api/items?type=${type}`;
    console.log('Fetching items from:', url);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      throw new Error(error.details || 'Failed to fetch items');
    }

    const data = await response.json();
    console.log('Raw response data:', data);
    console.log('Items fetched successfully:', data.length, 'items');
    
    const transformedData = data.map((item: any) => ({
      ...item,
      dateLostFound: item.dateLostFound ? new Date(item.dateLostFound) : undefined
    }));
    
    console.log('Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error getting items:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

export const searchItems = async (type: 'Lost' | 'Found', searchQuery: string): Promise<Item[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/items/search?type=${type}&query=${encodeURIComponent(searchQuery)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to search items');
    }

    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      dateLostFound: item.dateLostFound ? new Date(item.dateLostFound) : undefined
    }));
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
};

// User Operations
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to create user');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const registerUser = async (userData: Omit<User, 'id'> & { password: string }) => {
  // Check if email already exists
  const response = await fetch(`${API_BASE_URL}/api/users`);
  const users = await response.json();
  const exists = users.some((u: any) => u.email === userData.email);
  if (exists) {
    throw new Error('Email already exists');
  }
  // Add user
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.details || 'Failed to register user');
  }
  return await res.json();
};

export const loginUser = async (identifier: string, password: string) => {
  try {
    console.log('Attempting login for:', identifier);
        const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrName: identifier,
        password: password
      })
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Login error:', error);
      throw new Error(error.error || 'Login failed');
    }

    const user = await response.json();
    console.log('Login successful for user:', user);
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<Omit<User, 'id'>>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Helper functions for Lost and Found items
export const getLostItems = async (): Promise<Item[]> => {
  return getItems('Lost');
};

export const getFoundItems = async (): Promise<Item[]> => {
  return getItems('Found');
};

export const searchLostItems = async (searchQuery: string): Promise<Item[]> => {
  return searchItems('Lost', searchQuery);
};

export const searchFoundItems = async (searchQuery: string): Promise<Item[]> => {
  return searchItems('Found', searchQuery);
};

export const getUserItems = async (userId: string, type: 'Lost' | 'Found'): Promise<Item[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items?type=${type}&reportUserId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || `Failed to fetch ${type} items for user`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      dateLostFound: item.dateLostFound ? new Date(item.dateLostFound) : undefined
    }));
  } catch (error) {
    console.error(`Error getting user's ${type} items:`, error);
    throw error;
  }
};

export const searchUsers = async (searchQuery: string): Promise<User[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/search?query=${encodeURIComponent(searchQuery)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to search users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Message Operations
export const sendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<string> => {
  try {
        const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to send message');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (userId: string, chatWith?: string): Promise<Message[]> => {
  try {
        const url = chatWith 
          ? `${API_BASE_URL}/api/messages?userId=${userId}&chatWith=${chatWith}`
          : `${API_BASE_URL}/api/messages?userId=${userId}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch messages');
    }

    const data = await response.json();
    return data.map((message: any) => ({
      ...message,
      timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Profile Photo Upload (Base64 approach)
export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
  try {
    console.log('Starting profile photo upload...');
    console.log('User ID:', userId);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    // Convert file to base64 for Firebase Functions
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    console.log('Base64 conversion completed, sending request...');
    const response = await fetch(`${API_BASE_URL}/api/upload-profile-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        imageData: base64
      }),
    });

    console.log('Response received:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Failed to upload profile photo';
      try {
        const error = await response.json();
        errorMessage = error.error || error.details || errorMessage;
        console.error('Upload error response:', error);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Upload successful, response data:', data);
    return data.avatarUrl;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

// Admin Operations
export const getAdminDashboard = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch admin dashboard data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting admin dashboard data:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to update user role');
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId: string, isActive: boolean): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to update user status');
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/items/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const updateItem = async (itemId: string, itemData: Partial<Item>): Promise<Item> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update item');
    }

    const updatedItem = await response.json();
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const createItem = async (itemData: Omit<Item, 'id'>): Promise<Item> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create item');
    }

    const newItem = await response.json();
    return newItem;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const getAllItems = async (): Promise<Item[]> => {
  try {
    const [lostItems, foundItems] = await Promise.all([
      getItems('Lost'),
      getItems('Found')
    ]);
    return [...lostItems, ...foundItems];
  } catch (error) {
    console.error('Error fetching all items:', error);
    throw error;
  }
};

export const getAllMessages = async (): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/messages`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch messages');
    }

    const data = await response.json();
    return data.map((message: any) => ({
      ...message,
      timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
    }));
  } catch (error) {
    console.error('Error getting all messages:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/messages/${messageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to delete message');
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (userId: string, chatWith: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/mark-as-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, chatWith }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark messages as read');
    }

    console.log('Messages marked as read successfully');
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

export const updateMessageStatus = async (messageId: string, status: 'sent' | 'delivered' | 'seen'): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update message status');
    }

    console.log(`Message ${messageId} status updated to ${status}`);
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

export const uploadItemImage = async (file: File): Promise<string> => {
  try {
    console.log('Starting image upload for file:', file.name);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.type);
    
    // Convert file to base64 for Firebase Functions
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('File converted to base64, length:', reader.result?.toString().length);
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });

    console.log('Sending upload request to:', `${API_BASE_URL}/api/upload-item-image`);
    
    const response = await fetch(`${API_BASE_URL}/api/upload-item-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData: base64Data }),
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Upload error response:', error);
      throw new Error(error.error || 'Failed to upload image');
    }

    const result = await response.json();
    console.log('Upload successful, imageUrl:', result.imageUrl);
    return result.imageUrl;
  } catch (error) {
    console.error('Error uploading item image:', error);
    throw error;
  }
};
