export interface Item {
  id?: string;  // Auto-generated
  dateLostFound: Date;
  description: string;
  imageUrl: string;
  locationLostFound: string;
  name: string;
  phoneNumber: string;
  reportUserId: string;
  reportName?: string;
  status: string;
  type: string;
}

export interface User {
  id?: string;  // Auto-generated
  email: string;
  name: string;
  phoneNumber: string;
  uweId: string;
  password?: string;  // For login purposes
  avatar?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
}

export interface Message {
  id?: string;  // Auto-generated
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'seen';
  deliveredAt?: Date;
  seenAt?: Date;
  messageType?: 'chat' | 'email'; // Distinguish between chat and email messages
  attachment?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    data: string; // Base64 encoded data
  };
}

export interface AdminStats {
  totalUsers: number;
  totalItems: number;
  totalLostItems: number;
  totalFoundItems: number;
  totalMessages: number;
  activeUsers: number;
  recentItems: Item[];
  recentUsers: User[];
}

export interface AdminDashboardData {
  stats: AdminStats;
  chartData: {
    itemsByMonth: { month: string; lost: number; found: number }[];
    usersByMonth: { month: string; count: number }[];
  };
} 