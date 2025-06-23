# Phase 2: Database Schema & Chat Persistence

## Execution Command
```bash
claude-code "Execute Phase 2: Database Schema & Chat Persistence" /path/to/phase-2-database-persistence.md
```

## Objective
Implement Appwrite Database for persistent storage of chats, messages, and contexts with real-time synchronization.

## Prerequisites
- Phase 1 completed (Authentication working)
- Appwrite console access for creating collections
- Understanding of existing IndexedDB structure

## Task Checklist

### 1. Create Database in Appwrite Console
Create a new database called "whatsflex" with proper permissions.

### 2. Create Collections Schema

#### Chats Collection
Collection ID: `chats`
Attributes:
- `userId` (string, required) - Owner of the chat
- `name` (string, required, max: 100) - Chat name
- `lastMessage` (string, max: 500) - Preview of last message
- `lastMessageAt` (datetime) - Timestamp of last message
- `archived` (boolean, default: false) - Archive status
- `contextIds` (string[], max: 20) - Associated context IDs
- `messageCount` (integer, default: 0) - Total messages
- `createdAt` (datetime, required) - Creation timestamp
- `updatedAt` (datetime, required) - Last update timestamp

Indexes:
- `userId_updatedAt` (userId ASC, updatedAt DESC) - For user's chat list
- `userId_archived` (userId ASC, archived ASC) - For filtering

#### Messages Collection
Collection ID: `messages`
Attributes:
- `chatId` (string, required) - Parent chat ID
- `userId` (string, required) - Message sender
- `content` (string, required, max: 10000) - Message content
- `role` (enum: ['user', 'assistant', 'system'], required)
- `status` (enum: ['sending', 'sent', 'delivered', 'read', 'failed'])
- `thinking` (string, max: 5000) - JSON string of AI thinking
- `attachments` (string[], max: 10) - File IDs
- `contextIds` (string[], max: 20) - Contexts used
- `createdAt` (datetime, required) - Message timestamp

Indexes:
- `chatId_createdAt` (chatId ASC, createdAt DESC) - For message list
- `userId_createdAt` (userId ASC, createdAt DESC) - For user's messages

#### Contexts Collection
Collection ID: `contexts`
Attributes:
- `userId` (string, required) - Context owner
- `title` (string, required, max: 200) - Context title
- `content` (string, required, max: 50000) - Context content
- `category` (enum: ['knowledge', 'document', 'chat', 'code', 'custom'])
- `tags` (string[], max: 20) - Searchable tags
- `usageCount` (integer, default: 0) - Times used
- `lastUsedAt` (datetime) - Last usage timestamp
- `metadata` (string, max: 2000) - JSON metadata
- `isFavorite` (boolean, default: false)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

Indexes:
- `userId_category` (userId ASC, category ASC)
- `userId_updatedAt` (userId ASC, updatedAt DESC)
- `userId_usageCount` (userId ASC, usageCount DESC)

### 3. Create Database Service
Create `src/services/appwrite/database.ts`:

```typescript
import { databases, ID } from './config';
import { Query } from 'appwrite';

const DB_ID = 'whatsflex';
const COLLECTIONS = {
  CHATS: 'chats',
  MESSAGES: 'messages',
  CONTEXTS: 'contexts'
};

export class DatabaseService {
  // Chat operations
  async createChat(userId: string, name: string, contextIds?: string[])
  async getChats(userId: string, archived = false)
  async updateChat(chatId: string, updates: Partial<Chat>)
  async deleteChat(chatId: string)
  
  // Message operations
  async createMessage(message: Omit<Message, 'id'>)
  async getMessages(chatId: string, limit = 50, offset = 0)
  async updateMessageStatus(messageId: string, status: MessageStatus)
  async deleteMessage(messageId: string)
  
  // Context operations
  async createContext(context: Omit<Context, 'id'>)
  async getContexts(userId: string, filters?: ContextFilters)
  async updateContext(contextId: string, updates: Partial<Context>)
  async deleteContext(contextId: string)
  async incrementContextUsage(contextId: string)
  
  // Real-time subscriptions
  subscribeToChat(chatId: string, callback: (message: Message) => void)
  subscribeToUserChats(userId: string, callback: (chat: Chat) => void)
}
```

### 4. Create Storage Service for Files
Create `src/services/appwrite/storage.ts`:

```typescript
export class StorageService {
  async uploadFile(file: File, bucketId = 'chat-attachments')
  async getFileUrl(fileId: string, bucketId = 'chat-attachments')
  async getFilePreview(fileId: string, width?: number, height?: number)
  async deleteFile(fileId: string, bucketId = 'chat-attachments')
  async uploadVoiceMessage(blob: Blob, chatId: string)
}
```

### 5. Update Store Integration

#### Update ChatStore
Modify `src/stores/chatStore.ts`:
- Integrate DatabaseService for all operations
- Implement hybrid sync (local + cloud)
- Add real-time subscriptions
- Handle offline queue
- Implement conflict resolution
- Add optimistic updates

#### Update ContextStore  
Modify `src/stores/contextStore.ts`:
- Use DatabaseService for CRUD
- Implement search with Appwrite queries
- Add usage tracking
- Handle favorites
- Sync with cloud

### 6. Implement Sync Manager
Create `src/services/syncManager.ts`:

```typescript
class SyncManager {
  private syncQueue: SyncOperation[] = [];
  private isOnline = navigator.onLine;
  
  async queueOperation(operation: SyncOperation)
  async processSyncQueue()
  async syncLocalToCloud()
  async syncCloudToLocal()
  handleConflict(local: any, cloud: any): any
}
```

### 7. Add Real-time Features
- Subscribe to chat updates
- Subscribe to new messages
- Handle presence (typing indicators)
- Update UI optimistically
- Handle connection state

### 8. Migration from IndexedDB
Create `src/utils/migration.ts`:
- Detect existing IndexedDB data
- Prompt user to migrate
- Upload data to Appwrite
- Maintain data integrity
- Handle migration errors

### 9. Update Message Composer
- Add file attachment UI
- Show upload progress
- Handle multiple files
- Add file type validation
- Preview attachments

### 10. Test Data Persistence
- Create new chats
- Send messages with attachments
- Update message status
- Search contexts
- Test offline mode
- Verify sync works
- Test real-time updates

## Acceptance Criteria
- [ ] All chats persist to Appwrite
- [ ] Messages save and load correctly
- [ ] File attachments upload and display
- [ ] Real-time updates work across tabs
- [ ] Offline changes sync when online
- [ ] Search works for contexts
- [ ] Migration from IndexedDB completes
- [ ] No data loss during sync
- [ ] Performance remains smooth
- [ ] Conflict resolution works

## Performance Considerations
- Implement pagination for messages
- Cache frequently used contexts
- Lazy load attachments
- Use indexes efficiently
- Batch operations when possible
- Implement virtual scrolling

## Error Handling
- Network failure recovery
- Quota exceeded handling
- Permission errors
- Sync conflict resolution
- File upload failures
- Real-time reconnection

## Security Considerations
- User can only access own data
- File access control
- Input sanitization
- XSS prevention in messages
- Rate limiting awareness

## Next Steps
After Phase 2:
- Data persists reliably
- Real-time sync works
- Ready for Phase 3 (AI Integration)