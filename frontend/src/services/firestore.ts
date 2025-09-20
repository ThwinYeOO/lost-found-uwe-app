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

const API_BASE_URL = API_CONFIG.BASE_URL + '/api';

// Items Operations
export const addItem = async (item: Omit<Item, 'id'>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to add item');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const getItems = async (type: 'Lost' | 'Found'): Promise<Item[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/items?type=${type}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch items');
    }

    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      dateLostFound: item.dateLostFound ? new Date(item.dateLostFound) : undefined
    }));
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const searchItems = async (type: 'Lost' | 'Found', searchQuery: string): Promise<Item[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/search?type=${type}&query=${encodeURIComponent(searchQuery)}`
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
    const response = await fetch(`${API_BASE_URL}/users`);

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
  const response = await fetch(`${API_BASE_URL}/users`);
  const users = await response.json();
  const exists = users.some((u: any) => u.email === userData.email);
  if (exists) {
    throw new Error('Email already exists');
  }
  // Add user
  const res = await fetch(`${API_BASE_URL}/users`, {
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
    // identifier can be email or name
    const response = await fetch(`${API_BASE_URL}/users`);
    
    // Check if response is HTML (404 error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Backend not available. Please check if your backend server is running.');
    }
    
    if (!response.ok) {
      throw new Error('Backend not available. Please check if your backend server is running.');
    }
    
    const users = await response.json();
    const user = users.find((u: any) => (u.email === identifier || u.name === identifier) && u.password === password);
    if (!user) {
      throw new Error('Wrong username or password');
    }
    return user;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Backend not available') || error.message.includes('Wrong username or password'))) {
      throw error;
    }
    throw new Error('Backend not available. Please check if your backend server is running.');
  }
};

export const updateUser = async (userId: string, userData: Partial<Omit<User, 'id'>>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
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
    const response = await fetch(`${API_BASE_URL}/items?type=${type}&reportUserId=${encodeURIComponent(userId)}`);

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
      `${API_BASE_URL}/users/search?query=${encodeURIComponent(searchQuery)}`
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
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

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
export const sendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'read' | 'deliveredAt' | 'seenAt'>): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
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
      ? `${API_BASE_URL}/messages?userId=${userId}&chatWith=${chatWith}`
      : `${API_BASE_URL}/messages?userId=${userId}`;

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

// Profile Photo Upload
export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
  try {
    console.log('Creating FormData for upload...');
    const formData = new FormData();
    formData.append('profilePhoto', file);
    formData.append('userId', userId);

    console.log('Sending upload request to:', `${API_BASE_URL}/upload-profile-photo`);
    console.log('FormData contents:', {
      hasProfilePhoto: formData.has('profilePhoto'),
      hasUserId: formData.has('userId'),
      userId: userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const response = await fetch(`${API_BASE_URL}/upload-profile-photo`, {
      method: 'POST',
      body: formData,
    });

    console.log('Upload response status:', response.status);
    console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Failed to upload profile photo';
      try {
        const error = await response.json();
        errorMessage = error.details || error.error || errorMessage;
        console.error('Upload error response:', error);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorMessage = `Upload failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Upload success response:', data);
    return data.avatarUrl;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error occurred during upload');
    }
  }
};

// Admin Operations
export const getAdminDashboard = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`);

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
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/items/${itemId}`, {
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

export const getAllMessages = async (): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/messages`);

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
    const response = await fetch(`${API_BASE_URL}/admin/messages/${messageId}`, {
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
