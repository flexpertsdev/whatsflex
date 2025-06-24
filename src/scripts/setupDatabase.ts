/**
 * Database Setup Script
 * 
 * IMPORTANT: This script is meant to be run server-side with the Appwrite Server SDK,
 * not with the client SDK used in the web application.
 * 
 * To set up the database:
 * 1. Use the Appwrite Console to create collections and attributes
 * 2. Or create a separate Node.js project with the Appwrite Server SDK
 * 
 * The collections and attributes defined below are for reference.
 */

import { DATABASE_ID } from '../services/appwrite/config';

// Collection IDs
export const COLLECTIONS = {
  CHATS: 'chats',
  MESSAGES: 'messages',
  CONTEXTS: 'contexts'
};

// Database schema for reference
export const SCHEMA = {
  CHATS: {
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'lastMessage', type: 'string', size: 1000, required: false },
      { key: 'lastMessageAt', type: 'datetime', required: false },
      { key: 'messageCount', type: 'integer', required: true, default: 0 },
      { key: 'unreadCount', type: 'integer', required: true, default: 0 },
      { key: 'archived', type: 'boolean', required: true, default: false },
      { key: 'contextIds', type: 'string[]', size: 255, required: false },
    ],
    indexes: [
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'lastMessageAt', type: 'key', attributes: ['lastMessageAt'], orders: ['desc'] },
    ]
  },
  MESSAGES: {
    attributes: [
      { key: 'chatId', type: 'string', size: 255, required: true },
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'content', type: 'string', size: 5000, required: true },
      { key: 'role', type: 'enum', elements: ['user', 'assistant', 'system'], required: true },
      { key: 'status', type: 'enum', elements: ['sending', 'sent', 'delivered', 'read', 'failed'], required: false, default: 'sent' },
      { key: 'attachments', type: 'string[]', size: 255, required: false },
      { key: 'contextIds', type: 'string[]', size: 255, required: false },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'editedAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'chatId', type: 'key', attributes: ['chatId'] },
      { key: 'createdAt', type: 'key', attributes: ['createdAt'], orders: ['desc'] },
    ]
  },
  CONTEXTS: {
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'content', type: 'string', size: 10000, required: true },
      { key: 'category', type: 'enum', elements: ['knowledge', 'document', 'chat', 'code', 'custom'], required: true, default: 'knowledge' },
      { key: 'tags', type: 'string[]', size: 100, required: false },
      { key: 'isFavorite', type: 'boolean', required: true, default: false },
      { key: 'usageCount', type: 'integer', required: true, default: 0 },
      { key: 'lastUsedAt', type: 'datetime', required: false },
      { key: 'metadata', type: 'string', size: 2000, required: false, default: '{}' },
    ],
    indexes: [
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'category', type: 'key', attributes: ['category'] },
      { key: 'isFavorite', type: 'key', attributes: ['isFavorite'] },
      { key: 'usageCount', type: 'key', attributes: ['usageCount'], orders: ['desc'] },
    ]
  }
};

console.log(`
Database Setup Instructions:
1. Create a database with ID: ${DATABASE_ID}
2. Create the following collections with their attributes and indexes:
`, JSON.stringify(SCHEMA, null, 2));