// lib/store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserType = "Buyer" | "Farmer" | null;

export interface Product {
  id: string;
  livestock_type: string;
  breed_type: string;
  quantity: number;
  price_per_bird: number | null;
  media_urls: string[];
  farmer_name: string;
  created_at: string;
  description: string;
  farmer_id: string;
}

interface PROFILE {
  created_at: string;
  display_name: string;
  hedera_account_id: string;
  hedera_private_key_encrypted: string;
  hedera_public_key: string;
  hedera_wallet: string;
  id: string;
  updated_at: string;
  usertype: string;
}

interface StoreState {
  count: number;
  user: { name: string; email: string } | null;
  sidebarOpen: boolean;
  userType: UserType;
  farmProducts: Product[];
  profile: PROFILE[];
  setProfile: (profile: PROFILE[]) => void;
  setFarmProducts: (farmProducts: Product[]) => void;
  setUserType: (type: UserType) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  increase: () => void;
  decrease: () => void;
  setUser: (user: { name: string; email: string }) => void;
  clearUser: () => void;
  clearUserType: () => void;
  clearAll: () => void;
}

// CRITICAL FIX: Wrap the store with persist middleware
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      count: 0,
      user: null,
      sidebarOpen: true,
      userType: null,
      farmProducts: [],
      profile: [],
      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setUserType: (userType) => set({ userType }),
      clearUserType: () => set({ userType: null }),
      setFarmProducts: (farmProducts) => set({ farmProducts }),
      setProfile: (profile) => set({ profile }),

      clearAll: () => {
        set({
          count: 0,
          user: null,
          sidebarOpen: true,
          userType: null,
          farmProducts: [],
          profile: [],
        });
        localStorage.removeItem("poultry-pulse-storage");
      },
    }),
    {
      name: "poultry-pulse-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Optional: Only persist specific fields if you don't want everything saved
      partialize: (state) => ({
        userType: state.userType,
        user: state.user,
        profile: state.profile,
        // Don't persist sidebarOpen, count, or farmProducts to keep localStorage clean
      }),
    }
  )
);
