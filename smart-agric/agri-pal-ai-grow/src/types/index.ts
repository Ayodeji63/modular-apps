
export type UserRole = 'farmer' | 'law';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  farmId?: string; // Only for farmers
}

export interface Farm {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  status: 'clear' | 'warning' | 'danger';
  lastUpdated: string;
  ownerId: string;
  deviceStatus: 'online' | 'offline';
  lastOnline: string;
}

export interface Intrusion {
  id: string;
  farmId: string;
  timestamp: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolvedAt?: string;
  imageUrl?: string;
  details?: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  phoneNumber?: string;
}

// Helper functions for formatting
export const formatTimestamp = (intrusion: Intrusion): string => {
  try {
    const date = new Date(intrusion.timestamp);
    return date.toLocaleString();
  } catch (e) {
    return intrusion.timestamp || 'Unknown';
  }
};

export const formatLocation = (intrusion: Intrusion): string => {
  return intrusion.location || 'Unknown location';
};
