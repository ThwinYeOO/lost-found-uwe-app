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
  avatar?: string;
} 