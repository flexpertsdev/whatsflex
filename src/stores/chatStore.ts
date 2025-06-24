import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { databaseService } from '../services/appwrite/database';
import { storageService } from '../services/appwrite/storage';
import { syncManager } from '../services/syncManager';
import type { Chat, Message, MessageStatus } from '../services/appwrite/database';
import type { FileUploadResult } from '../services/appwrite/storage';

interface ChatState {
  // Data
  chats: Chat[];
  currentChat: Chat | null;
  messages: Record<string, Message[]>; // chatId -> messages
  loadingChats: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  error: string | null;
  
  // Subscriptions
  unsubscribeChat: (() => void) | null;
  unsubscribeUserChats: (() => void) | null;
  
  // Chat operations
  loadChats: (userId: string) => Promise<void>;
  createChat: (userId: string, name: string, contextIds?: string[]) => Promise<Chat>;
  selectChat: (chatId: string) => Promise<void>;
  updateChat: (chatId: string, updates: Partial<Chat>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  archiveChat: (chatId: string) => Promise<void>;
  
  // Message operations
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  updateMessageStatus: (messageId: string, status: MessageStatus) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  
  // File operations
  uploadAttachments: (files: File[]) => Promise<FileUploadResult[]>;
  
  // Real-time
  subscribeToCurrentChat: () => void;
  unsubscribeFromCurrentChat: () => void;
  subscribeToUserChats: (userId: string) => void;
  unsubscribeFromUserChats: () => void;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      chats: [],
      currentChat: null,
      messages: {},
      loadingChats: false,
      loadingMessages: false,
      sendingMessage: false,
      error: null,
      unsubscribeChat: null,
      unsubscribeUserChats: null,
      
      // Load user's chats
      loadChats: async (userId: string) => {
        set({ loadingChats: true, error: null });
        try {
          const chats = await databaseService.getChats(userId);
          set({ chats, loadingChats: false });
        } catch (error: any) {
          set({ error: error.message, loadingChats: false });
        }
      },
      
      // Create new chat
      createChat: async (userId: string, name: string, contextIds?: string[]) => {
        try {
          const chat = await databaseService.createChat(userId, name, contextIds);
          set(state => ({ 
            chats: [chat, ...state.chats],
            currentChat: chat 
          }));
          return chat;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Select and load chat
      selectChat: async (chatId: string) => {
        const state = get();
        
        // Unsubscribe from previous chat
        state.unsubscribeFromCurrentChat();
        
        // Get chat details
        const chat = await databaseService.getChat(chatId);
        if (!chat) {
          set({ error: 'Chat not found' });
          return;
        }
        
        set({ currentChat: chat });
        
        // Load messages if not cached
        if (!state.messages[chatId]) {
          await state.loadMessages(chatId);
        }
        
        // Subscribe to new messages
        state.subscribeToCurrentChat();
      },
      
      // Update chat
      updateChat: async (chatId: string, updates: Partial<Chat>) => {
        try {
          const updatedChat = await databaseService.updateChat(chatId, updates);
          set(state => ({
            chats: state.chats.map(c => c.$id === chatId ? updatedChat : c),
            currentChat: state.currentChat?.$id === chatId ? updatedChat : state.currentChat
          }));
        } catch (error: any) {
          set({ error: error.message });
          // Queue for sync if offline
          if (!navigator.onLine) {
            await syncManager.queueOperation({
              type: 'update',
              collection: 'chats',
              data: { id: chatId, updates }
            });
          }
        }
      },
      
      // Delete chat
      deleteChat: async (chatId: string) => {
        try {
          await databaseService.deleteChat(chatId);
          set(state => {
            const { [chatId]: _, ...remainingMessages } = state.messages;
            return {
              chats: state.chats.filter(c => c.$id !== chatId),
              currentChat: state.currentChat?.$id === chatId ? null : state.currentChat,
              messages: remainingMessages
            };
          });
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      
      // Archive chat
      archiveChat: async (chatId: string) => {
        await get().updateChat(chatId, { archived: true });
      },
      
      // Load messages for a chat
      loadMessages: async (chatId: string) => {
        set({ loadingMessages: true, error: null });
        try {
          const messages = await databaseService.getMessages(chatId);
          set(state => ({
            messages: { ...state.messages, [chatId]: messages },
            loadingMessages: false
          }));
        } catch (error: any) {
          set({ error: error.message, loadingMessages: false });
        }
      },
      
      // Send message
      sendMessage: async (content: string, attachments?: File[]) => {
        const state = get();
        if (!state.currentChat) {
          set({ error: 'No chat selected' });
          return;
        }
        
        const { user } = await import('./appStore').then(m => m.useAppStore.getState());
        if (!user) {
          set({ error: 'User not authenticated' });
          return;
        }
        
        set({ sendingMessage: true, error: null });
        
        try {
          // Upload attachments first
          let attachmentIds: string[] = [];
          if (attachments && attachments.length > 0) {
            const uploads = await state.uploadAttachments(attachments);
            attachmentIds = uploads.map(u => u.id);
          }
          
          // Create message
          const message = await databaseService.createMessage({
            chatId: state.currentChat.$id,
            userId: user.id,
            content,
            role: 'user',
            status: 'sent',
            attachments: attachmentIds,
            contextIds: state.currentChat.contextIds,
            createdAt: new Date().toISOString()
          });
          
          // Optimistically add to state
          set(state => ({
            messages: {
              ...state.messages,
              [state.currentChat!.$id]: [...(state.messages[state.currentChat!.$id] || []), message]
            },
            sendingMessage: false
          }));
          
        } catch (error: any) {
          set({ error: error.message, sendingMessage: false });
          
          // Queue for sync if offline
          if (!navigator.onLine) {
            await syncManager.queueOperation({
              type: 'create',
              collection: 'messages',
              data: {
                chatId: state.currentChat.$id,
                userId: user.id,
                content,
                role: 'user',
                status: 'sending',
                attachments: [],
                contextIds: state.currentChat.contextIds
              }
            });
          }
        }
      },
      
      // Update message status
      updateMessageStatus: async (messageId: string, status: MessageStatus) => {
        try {
          await databaseService.updateMessageStatus(messageId, status);
          
          // Update local state
          set(state => {
            const newMessages = { ...state.messages };
            Object.keys(newMessages).forEach(chatId => {
              if (newMessages[chatId]) {
                newMessages[chatId] = newMessages[chatId].map(msg =>
                  msg.$id === messageId ? { ...msg, status } : msg
                );
              }
            });
            return { messages: newMessages };
          });
        } catch (error: any) {
          console.error('Failed to update message status:', error);
        }
      },
      
      // Delete message
      deleteMessage: async (messageId: string) => {
        try {
          await databaseService.deleteMessage(messageId);
          
          // Remove from local state
          set(state => {
            const newMessages = { ...state.messages };
            Object.keys(newMessages).forEach(chatId => {
              if (newMessages[chatId]) {
                newMessages[chatId] = newMessages[chatId].filter(msg => msg.$id !== messageId);
              }
            });
            return { messages: newMessages };
          });
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      
      // Upload attachments
      uploadAttachments: async (files: File[]) => {
        try {
          return await storageService.uploadFiles(files);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Subscribe to current chat messages
      subscribeToCurrentChat: () => {
        const state = get();
        if (!state.currentChat) return;
        
        const unsubscribe = databaseService.subscribeToChat(
          state.currentChat.$id,
          (message) => {
            set(state => ({
              messages: {
                ...state.messages,
                [state.currentChat!.$id]: [...(state.messages[state.currentChat!.$id] || []), message]
              }
            }));
          }
        );
        
        set({ unsubscribeChat: unsubscribe });
      },
      
      // Unsubscribe from current chat
      unsubscribeFromCurrentChat: () => {
        const state = get();
        if (state.unsubscribeChat) {
          state.unsubscribeChat();
          set({ unsubscribeChat: null });
        }
      },
      
      // Subscribe to user's chats
      subscribeToUserChats: (userId: string) => {
        const unsubscribe = databaseService.subscribeToUserChats(
          userId,
          (chat) => {
            set(state => {
              const existingIndex = state.chats.findIndex(c => c.$id === chat.$id);
              if (existingIndex >= 0) {
                // Update existing chat
                const newChats = [...state.chats];
                newChats[existingIndex] = chat;
                return { chats: newChats };
              } else {
                // Add new chat
                return { chats: [chat, ...state.chats] };
              }
            });
          }
        );
        
        set({ unsubscribeUserChats: unsubscribe });
      },
      
      // Unsubscribe from user's chats
      unsubscribeFromUserChats: () => {
        const state = get();
        if (state.unsubscribeUserChats) {
          state.unsubscribeUserChats();
          set({ unsubscribeUserChats: null });
        }
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Reset store
      reset: () => {
        const state = get();
        state.unsubscribeFromCurrentChat();
        state.unsubscribeFromUserChats();
        
        set({
          chats: [],
          currentChat: null,
          messages: {},
          loadingChats: false,
          loadingMessages: false,
          sendingMessage: false,
          error: null,
          unsubscribeChat: null,
          unsubscribeUserChats: null
        });
      }
    }),
    {
      name: 'whatsflex-chat-store',
      partialize: (state) => ({
        // Only persist essential data
        currentChat: state.currentChat,
        messages: state.messages
      })
    }
  )
);