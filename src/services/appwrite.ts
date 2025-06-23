import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Appwrite configuration
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'main';
export const COLLECTIONS = {
  CHATS: import.meta.env.VITE_APPWRITE_CHATS_COLLECTION || 'chats',
  MESSAGES: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION || 'messages',
  CONTEXTS: import.meta.env.VITE_APPWRITE_CONTEXTS_COLLECTION || 'contexts',
  USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION || 'users',
};

// Storage bucket IDs
export const BUCKETS = {
  ATTACHMENTS: import.meta.env.VITE_APPWRITE_ATTACHMENTS_BUCKET || 'attachments',
  AVATARS: import.meta.env.VITE_APPWRITE_AVATARS_BUCKET || 'avatars',
};

// Helper types
export interface User {
  $id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  $id: string;
  title: string;
  userId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  contextIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  $id: string;
  chatId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachmentIds?: string[];
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Context {
  $id: string;
  userId: string;
  title: string;
  description?: string;
  content: string;
  type: 'text' | 'file' | 'url';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}