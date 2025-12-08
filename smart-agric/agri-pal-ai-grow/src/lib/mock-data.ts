
import { Farm, Intrusion, User, NotificationSettings } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "farmer@example.com",
    name: "John Farmer",
    role: "farmer",
    farmId: "farm1"
  },
  {
    id: "2",
    email: "farmer2@example.com",
    name: "Jane Farmer",
    role: "farmer",
    farmId: "farm2"
  },
  {
    id: "3",
    email: "law@example.com",
    name: "Officer Smith",
    role: "law"
  }
];

// Mock Farms
export const mockFarms: Farm[] = [
  {
    id: "farm1",
    name: "Ibadan Cassava Fields",
    location: {
      lat: 7.3775,
      lng: 3.9470
    },
    address: "Ajibode Road, Ibadan, Oyo State, Nigeria",
    status: "clear",
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    ownerId: "1",
    deviceStatus: "online",
    lastOnline: new Date().toISOString()
  },
  {
    id: "farm2",
    name: "Kaduna Maize Plantation",
    location: {
      lat: 10.5105,
      lng: 7.4165
    },
    address: "Zaria-Kaduna Road, Kaduna, Nigeria",
    status: "danger",
    lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    ownerId: "2",
    deviceStatus: "online",
    lastOnline: new Date().toISOString()
  },
  {
    id: "farm3",
    name: "Benue Yam Farm",
    location: {
      lat: 7.3370,
      lng: 8.7406
    },
    address: "Otukpo Road, Makurdi, Benue State, Nigeria",
    status: "warning",
    lastUpdated: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    ownerId: "3",
    deviceStatus: "offline",
    lastOnline: new Date(Date.now() - 30 * 60000).toISOString() // 30 minutes ago
  }
];


// Mock Intrusions
export const mockIntrusions: Intrusion[] = [
  {
    id: "1",
    farmId: "farm2",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    location: "Ogbomoso North Farm 1",
    severity: "high",
    resolved: false,
    imageUrl: "/placeholder.svg",
    details: "Multiple cattle detected near the north fence. Camera triggered at section 3."
  },
  {
    id: "2",
    farmId: "farm3",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    location: "Ogbomoso North Farm 4",
    severity: "medium",
    resolved: false,
    imageUrl: "/placeholder.svg",
    details: "Movement detected at east gate. Single animal detected."
  },
  {
    id: "3",
    farmId: "farm1",
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    location: "Ogbomoso South Farm 4",
    severity: "low",
    resolved: true,
    resolvedAt: new Date(Date.now() - 1.5 * 60 * 60000).toISOString(), // 1.5 hours ago
    imageUrl: "/placeholder.svg",
    details: "Brief movement detected. False alarm confirmed."
  },
  {
    id: "4",
    farmId: "farm2",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
    location: "Ilorin North Farm 3",
    severity: "high",
    resolved: true,
    resolvedAt: new Date(Date.now() - 23 * 60 * 60000).toISOString(), // 23 hours ago
    imageUrl: "/placeholder.svg",
    details: "Multiple cattle detected. Deterrent activated successfully."
  },
  {
    id: "5",
    farmId: "farm1",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    location: "Ilorin North Farm 6",
    severity: "medium",
    resolved: true,
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60000 + 30 * 60000).toISOString(), // 3 days ago + 30 minutes
    imageUrl: "/placeholder.svg",
    details: "Single animal detected at gate. Farmer notified."
  }
];

// Mock Notification Settings
export const mockNotificationSettings: Record<string, NotificationSettings> = {
  "1": {
    email: true,
    sms: true,
    push: false,
    phoneNumber: "555-123-4567"
  },
  "2": {
    email: true,
    sms: false,
    push: true
  }
};
