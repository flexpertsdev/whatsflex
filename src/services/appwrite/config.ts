import { Client, Account, Databases, Functions, Storage, Teams } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Configure the client with environment variables
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

// Export service instances
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Export Appwrite ID generator
export { ID } from 'appwrite';

// Export the client for advanced usage
export { client };

// Database and collection IDs
export const DATABASE_ID = 'whatsflex';
export const COLLECTIONS = {
  CHATS: 'chats',
  MESSAGES: 'messages',
  CONTEXTS: 'contexts',
} as const;

// Storage bucket IDs
export const BUCKETS = {
  ATTACHMENTS: 'chat-attachments',
  VOICE_MESSAGES: 'voice-messages',
  AVATARS: 'user-avatars',
} as const;

// Function IDs
export const FUNCTIONS_IDS = {
  ANTHROPIC_CHAT: 'anthropic-chat',
  CONTEXT_GENERATOR: 'context-generator',
} as const;