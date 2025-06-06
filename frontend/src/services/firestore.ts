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
import { Item, User } from '../types';

// Collection references
const ITEMS_COLLECTION = 'items';
const USERS_COLLECTION = 'users';

const API_BASE_URL = 'http://localhost:5001/api';

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