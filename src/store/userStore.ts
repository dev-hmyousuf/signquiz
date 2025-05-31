import { create } from 'zustand';
import { User as ClerkUser } from '@clerk/clerk-react';
import { getUserByClerkId, createUser, updateUserXP, addUserBadge } from '../lib/appwrite';
import { generateUsername } from '../lib/utils';

interface AppwriteUser {
  $id: string;
  clerkId: string;
  email: string;
  username: string;
  xp: number;
  badges: string[];
  joinedAt: string;
}

interface UserState {
  clerkUser: ClerkUser | null;
  appwriteUser: AppwriteUser | null;
  isLoading: boolean;
  error: string | null;
  setClerkUser: (user: ClerkUser | null) => void;
  syncUser: () => Promise<void>;
  addXP: (xp: number) => Promise<void>;
  addBadge: (badge: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  clerkUser: null,
  appwriteUser: null,
  isLoading: false,
  error: null,
  
  setClerkUser: (user) => {
    set({ clerkUser: user });
    if (user) {
      get().syncUser();
    } else {
      set({ appwriteUser: null });
    }
  },
  
  syncUser: async () => {
    const { clerkUser } = get();
    if (!clerkUser) return;
    
    try {
      set({ isLoading: true, error: null });
      
      const clerkId = clerkUser.id;
      let user = await getUserByClerkId(clerkId);
      
      if (!user) {
        // User doesn't exist in Appwrite, create a new one
        const email = clerkUser.primaryEmailAddress?.emailAddress || '';
        const preferredUsername = clerkUser.username || generateUsername(email);
        
        user = await createUser(clerkId, email, preferredUsername);
        
        // If this is their first quiz, give them the first-quiz badge
        await addUserBadge(user.$id, 'first-quiz');
      }
      
      set({ appwriteUser: user as AppwriteUser, isLoading: false });
    } catch (error) {
      console.error("Error syncing user:", error);
      set({ error: "Failed to sync user data", isLoading: false });
    }
  },
  
  addXP: async (xp) => {
    const { appwriteUser } = get();
    if (!appwriteUser) return;
    
    try {
      const updatedUser = await updateUserXP(appwriteUser.$id, xp);
      set({ appwriteUser: updatedUser as AppwriteUser });
    } catch (error) {
      console.error("Error adding XP:", error);
      set({ error: "Failed to update XP" });
    }
  },
  
  addBadge: async (badge) => {
    const { appwriteUser } = get();
    if (!appwriteUser) return;
    
    try {
      const updatedUser = await addUserBadge(appwriteUser.$id, badge);
      set({ appwriteUser: updatedUser as AppwriteUser });
    } catch (error) {
      console.error("Error adding badge:", error);
      set({ error: "Failed to add badge" });
    }
  }
}));