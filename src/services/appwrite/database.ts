import { databases, DATABASE_ID, COLLECTIONS, ID } from './config';
import { Query } from 'appwrite';
import type { Models } from 'appwrite';

// Type definitions
export interface Chat extends Models.Document {
  userId: string;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
  archived: boolean;
  contextIds: string[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message extends Models.Document {
  chatId: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  thinking?: string;
  attachments?: string[];
  contextIds?: string[];
  createdAt: string;
}

export interface Context extends Models.Document {
  userId: string;
  title: string;
  content: string;
  category: 'knowledge' | 'document' | 'chat' | 'code' | 'custom';
  tags: string[];
  usageCount: number;
  lastUsedAt?: string;
  metadata?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MessageStatus = Message['status'];
export type ContextCategory = Context['category'];

export interface ContextFilters {
  category?: ContextCategory;
  isFavorite?: boolean;
  search?: string;
  tags?: string[];
}

export class DatabaseService {
  // Chat operations
  async createChat(
    userId: string, 
    name: string, 
    contextIds: string[] = []
  ): Promise<Chat> {
    const now = new Date().toISOString();
    
    const chat = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CHATS,
      ID.unique(),
      {
        userId,
        name,
        archived: false,
        contextIds,
        messageCount: 0,
        createdAt: now,
        updatedAt: now
      }
    );
    
    return chat as Chat;
  }

  async getChats(userId: string, archived = false): Promise<Chat[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHATS,
      [
        Query.equal('userId', userId),
        Query.equal('archived', archived),
        Query.orderDesc('updatedAt'),
        Query.limit(100)
      ]
    );
    
    return response.documents as Chat[];
  }

  async getChat(chatId: string): Promise<Chat | null> {
    try {
      const chat = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.CHATS,
        chatId
      );
      return chat as Chat;
    } catch (error) {
      console.error('Failed to get chat:', error);
      return null;
    }
  }

  async updateChat(chatId: string, updates: Partial<Chat>): Promise<Chat> {
    const chat = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CHATS,
      chatId,
      {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    );
    
    return chat as Chat;
  }

  async deleteChat(chatId: string): Promise<void> {
    // First delete all messages in the chat
    await this.deleteMessagesForChat(chatId);
    
    // Then delete the chat
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.CHATS,
      chatId
    );
  }

  private async deleteMessagesForChat(chatId: string): Promise<void> {
    let hasMore = true;
    
    while (hasMore) {
      const messages = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        [
          Query.equal('chatId', chatId),
          Query.limit(100)
        ]
      );
      
      if (messages.documents.length === 0) {
        hasMore = false;
        break;
      }
      
      // Delete in parallel
      await Promise.all(
        messages.documents.map(msg => 
          databases.deleteDocument(DATABASE_ID, COLLECTIONS.MESSAGES, msg.$id)
        )
      );
    }
  }

  // Message operations
  async createMessage(message: Omit<Message, '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions'>): Promise<Message> {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      ID.unique(),
      {
        ...message,
        createdAt: new Date().toISOString()
      }
    );
    
    // Update chat's last message and count
    await this.updateChat(message.chatId, {
      lastMessage: message.content.substring(0, 500),
      lastMessageAt: new Date().toISOString(),
      messageCount: (await this.getChat(message.chatId))?.messageCount || 0 + 1
    });
    
    return doc as Message;
  }

  async getMessages(chatId: string, limit = 50, offset = 0): Promise<Message[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      [
        Query.equal('chatId', chatId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ]
    );
    
    // Return in chronological order
    return response.documents.reverse() as Message[];
  }

  async updateMessageStatus(messageId: string, status: MessageStatus): Promise<Message> {
    const message = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      messageId,
      { status }
    );
    
    return message as Message;
  }

  async deleteMessage(messageId: string): Promise<void> {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      messageId
    );
  }

  // Context operations
  async createContext(context: Omit<Context, '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions'>): Promise<Context> {
    const now = new Date().toISOString();
    
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CONTEXTS,
      ID.unique(),
      {
        ...context,
        usageCount: 0,
        isFavorite: false,
        createdAt: now,
        updatedAt: now
      }
    );
    
    return doc as Context;
  }

  async getContexts(userId: string, filters?: ContextFilters): Promise<Context[]> {
    const queries = [
      Query.equal('userId', userId),
      Query.orderDesc('updatedAt'),
      Query.limit(100)
    ];
    
    if (filters?.category) {
      queries.push(Query.equal('category', filters.category));
    }
    
    if (filters?.isFavorite !== undefined) {
      queries.push(Query.equal('isFavorite', filters.isFavorite));
    }
    
    if (filters?.search) {
      queries.push(Query.search('title', filters.search));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CONTEXTS,
      queries
    );
    
    return response.documents as Context[];
  }

  async getContext(contextId: string): Promise<Context | null> {
    try {
      const context = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.CONTEXTS,
        contextId
      );
      return context as Context;
    } catch (error) {
      console.error('Failed to get context:', error);
      return null;
    }
  }

  async updateContext(contextId: string, updates: Partial<Context>): Promise<Context> {
    const context = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CONTEXTS,
      contextId,
      {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    );
    
    return context as Context;
  }

  async deleteContext(contextId: string): Promise<void> {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.CONTEXTS,
      contextId
    );
  }

  async incrementContextUsage(contextId: string): Promise<void> {
    const context = await this.getContext(contextId);
    if (!context) return;
    
    await this.updateContext(contextId, {
      usageCount: context.usageCount + 1,
      lastUsedAt: new Date().toISOString()
    });
  }

  // Real-time subscriptions
  subscribeToChat(chatId: string, callback: (message: Message) => void): () => void {
    const unsubscribe = databases.client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const message = response.payload as Message;
          if (message.chatId === chatId) {
            callback(message);
          }
        }
      }
    );
    
    return unsubscribe;
  }

  subscribeToUserChats(userId: string, callback: (chat: Chat) => void): () => void {
    const unsubscribe = databases.client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.CHATS}.documents`,
      (response) => {
        const chat = response.payload as Chat;
        if (chat.userId === userId) {
          callback(chat);
        }
      }
    );
    
    return unsubscribe;
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();