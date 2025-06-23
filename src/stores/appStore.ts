import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/appwrite/auth';
import type { AuthUser } from '../services/appwrite/auth';

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

interface AppState {
  // Auth state
  user: AuthUser | null;
  authState: AuthState;
  
  // App preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  
  // Onboarding
  isOnboarded: boolean;
  
  // Auth actions
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name?: string, email?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Preference actions
  updatePreferences: (prefs: Partial<AppState['preferences']>) => void;
  setOnboarded: (value: boolean) => void;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      authState: 'loading',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
        fontSize: 'medium',
      },
      isOnboarded: false,
      error: null,
      
      // Initialize auth state
      initAuth: async () => {
        set({ authState: 'loading', error: null });
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            set({ user, authState: 'authenticated' });
            // Load user preferences from Appwrite
            if (user.prefs.preferences) {
              set({ preferences: { ...get().preferences, ...user.prefs.preferences } });
            }
          } else {
            set({ authState: 'unauthenticated' });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ authState: 'unauthenticated' });
        }
      },
      
      // Login
      login: async (email: string, password: string) => {
        set({ error: null });
        try {
          const user = await authService.login(email, password);
          set({ user, authState: 'authenticated' });
          
          // Load user preferences
          if (user.prefs.preferences) {
            set({ preferences: { ...get().preferences, ...user.prefs.preferences } });
          }
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Register
      register: async (email: string, password: string, name: string) => {
        set({ error: null });
        try {
          const user = await authService.register(email, password, name);
          set({ user, authState: 'authenticated', isOnboarded: false });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Logout
      logout: async () => {
        set({ error: null });
        try {
          await authService.logout();
          set({ user: null, authState: 'unauthenticated' });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Update profile
      updateProfile: async (name?: string, email?: string) => {
        set({ error: null });
        try {
          const updatedUser = await authService.updateProfile(name, email);
          set({ user: updatedUser });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Reset password
      resetPassword: async (email: string) => {
        set({ error: null });
        try {
          await authService.resetPassword(email);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Update preferences
      updatePreferences: async (prefs: Partial<AppState['preferences']>) => {
        const newPreferences = { ...get().preferences, ...prefs };
        set({ preferences: newPreferences });
        
        // Save to Appwrite if authenticated
        if (get().user) {
          try {
            await authService.updatePreferences({ preferences: newPreferences });
          } catch (error) {
            console.error('Failed to save preferences:', error);
          }
        }
      },
      
      // Set onboarded
      setOnboarded: (value: boolean) => {
        set({ isOnboarded: value });
        
        // Save to Appwrite if authenticated
        if (get().user) {
          authService.updatePreferences({ isOnboarded: value }).catch(console.error);
        }
      },
      
      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'whatsflex-app-store',
      partialize: (state) => ({
        preferences: state.preferences,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);