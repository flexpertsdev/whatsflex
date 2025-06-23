import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { databaseService } from '../services/appwrite/database';
import { syncManager } from '../services/syncManager';
import type { Context, ContextCategory, ContextFilters } from '../services/appwrite/database';

interface ContextState {
  // Data
  contexts: Context[];
  selectedContexts: string[]; // IDs of selected contexts for current chat
  loadingContexts: boolean;
  error: string | null;
  
  // Context operations
  loadContexts: (userId: string, filters?: ContextFilters) => Promise<void>;
  createContext: (context: Omit<Context, '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions'>) => Promise<Context>;
  updateContext: (contextId: string, updates: Partial<Context>) => Promise<void>;
  deleteContext: (contextId: string) => Promise<void>;
  toggleFavorite: (contextId: string) => Promise<void>;
  
  // Selection operations
  toggleContext: (contextId: string) => void;
  selectContexts: (contextIds: string[]) => void;
  clearSelection: () => void;
  
  // Usage tracking
  trackContextUsage: (contextIds: string[]) => Promise<void>;
  
  // Search and filter
  searchContexts: (query: string) => Context[];
  filterByCategory: (category: ContextCategory) => Context[];
  filterByTags: (tags: string[]) => Context[];
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

export const useContextStore = create<ContextState>()(
  persist(
    (set, get) => ({
      // Initial state
      contexts: [],
      selectedContexts: [],
      loadingContexts: false,
      error: null,
      
      // Load contexts
      loadContexts: async (userId: string, filters?: ContextFilters) => {
        set({ loadingContexts: true, error: null });
        try {
          const contexts = await databaseService.getContexts(userId, filters);
          set({ contexts, loadingContexts: false });
        } catch (error: any) {
          set({ error: error.message, loadingContexts: false });
        }
      },
      
      // Create context
      createContext: async (context) => {
        try {
          const newContext = await databaseService.createContext(context);
          set(state => ({ 
            contexts: [newContext, ...state.contexts] 
          }));
          return newContext;
        } catch (error: any) {
          set({ error: error.message });
          
          // Queue for sync if offline
          if (!navigator.onLine) {
            await syncManager.queueOperation({
              type: 'create',
              collection: 'contexts',
              data: context
            });
          }
          throw error;
        }
      },
      
      // Update context
      updateContext: async (contextId: string, updates: Partial<Context>) => {
        try {
          const updatedContext = await databaseService.updateContext(contextId, updates);
          set(state => ({
            contexts: state.contexts.map(c => c.$id === contextId ? updatedContext : c)
          }));
        } catch (error: any) {
          set({ error: error.message });
          
          // Queue for sync if offline
          if (!navigator.onLine) {
            await syncManager.queueOperation({
              type: 'update',
              collection: 'contexts',
              data: { id: contextId, updates }
            });
          }
        }
      },
      
      // Delete context
      deleteContext: async (contextId: string) => {
        try {
          await databaseService.deleteContext(contextId);
          set(state => ({
            contexts: state.contexts.filter(c => c.$id !== contextId),
            selectedContexts: state.selectedContexts.filter(id => id !== contextId)
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      
      // Toggle favorite
      toggleFavorite: async (contextId: string) => {
        const context = get().contexts.find(c => c.$id === contextId);
        if (!context) return;
        
        await get().updateContext(contextId, { 
          isFavorite: !context.isFavorite 
        });
      },
      
      // Toggle context selection
      toggleContext: (contextId: string) => {
        set(state => ({
          selectedContexts: state.selectedContexts.includes(contextId)
            ? state.selectedContexts.filter(id => id !== contextId)
            : [...state.selectedContexts, contextId]
        }));
      },
      
      // Select multiple contexts
      selectContexts: (contextIds: string[]) => {
        set({ selectedContexts: contextIds });
      },
      
      // Clear selection
      clearSelection: () => {
        set({ selectedContexts: [] });
      },
      
      // Track context usage
      trackContextUsage: async (contextIds: string[]) => {
        try {
          await Promise.all(
            contextIds.map(id => databaseService.incrementContextUsage(id))
          );
          
          // Update local state
          set(state => ({
            contexts: state.contexts.map(c => {
              if (contextIds.includes(c.$id)) {
                return {
                  ...c,
                  usageCount: c.usageCount + 1,
                  lastUsedAt: new Date().toISOString()
                };
              }
              return c;
            })
          }));
        } catch (error) {
          console.error('Failed to track context usage:', error);
        }
      },
      
      // Search contexts
      searchContexts: (query: string) => {
        const state = get();
        const lowerQuery = query.toLowerCase();
        
        return state.contexts.filter(context =>
          context.title.toLowerCase().includes(lowerQuery) ||
          context.content.toLowerCase().includes(lowerQuery) ||
          context.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      },
      
      // Filter by category
      filterByCategory: (category: ContextCategory) => {
        const state = get();
        return state.contexts.filter(c => c.category === category);
      },
      
      // Filter by tags
      filterByTags: (tags: string[]) => {
        const state = get();
        return state.contexts.filter(context =>
          tags.some(tag => context.tags.includes(tag))
        );
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Reset store
      reset: () => {
        set({
          contexts: [],
          selectedContexts: [],
          loadingContexts: false,
          error: null
        });
      }
    }),
    {
      name: 'whatsflex-context-store',
      partialize: (state) => ({
        // Only persist selection
        selectedContexts: state.selectedContexts
      })
    }
  )
);