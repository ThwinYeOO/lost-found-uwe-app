export interface Item {
  id: string;
  itemName: string;
  category: string;
  location: string;
  dateLostFound: Date;
  description: string;
  contactInfo: string;
  status: string;
  type: 'Lost' | 'Found';
  userId: string;
  createdAt?: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  studentId: string;
  phoneNumber: string;
  createdAt: Date;
} 