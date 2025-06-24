import { databaseService } from './appwrite/database';

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'chats' | 'messages' | 'contexts';
  data: any;
  timestamp: number;
  retries: number;
}

export class SyncManager {
  private syncQueue: SyncOperation[] = [];
  private isOnline = navigator.onLine;
  private isSyncing = false;
  private syncInterval?: number;
  private readonly MAX_RETRIES = 3;
  private readonly SYNC_INTERVAL = 30000; // 30 seconds

  constructor() {
    this.loadQueue();
    this.setupEventListeners();
    this.startPeriodicSync();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Connection restored. Syncing...');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Connection lost. Queuing operations...');
    });

    // Sync before page unload
    window.addEventListener('beforeunload', () => {
      this.saveQueue();
    });
  }

  private startPeriodicSync() {
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.processSyncQueue();
      }
    }, this.SYNC_INTERVAL);
  }

  async queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retries'>) {
    const syncOp: SyncOperation = {
      ...operation,
      id: this.generateId(),
      timestamp: Date.now(),
      retries: 0
    };

    this.syncQueue.push(syncOp);
    this.saveQueue();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) return;
    
    this.isSyncing = true;
    const failedOperations: SyncOperation[] = [];

    for (const operation of this.syncQueue) {
      try {
        await this.executeSyncOperation(operation);
        console.log(`Synced ${operation.type} operation for ${operation.collection}`);
      } catch (error) {
        console.error(`Sync failed for operation ${operation.id}:`, error);
        operation.retries++;
        
        if (operation.retries < this.MAX_RETRIES) {
          failedOperations.push(operation);
        } else {
          console.error(`Operation ${operation.id} failed after ${this.MAX_RETRIES} retries`);
          // Could notify user about permanent failure
        }
      }
    }

    this.syncQueue = failedOperations;
    this.saveQueue();
    this.isSyncing = false;
  }

  private async executeSyncOperation(operation: SyncOperation) {
    const { type, collection, data } = operation;

    switch (collection) {
      case 'chats':
        return this.syncChatOperation(type, data);
      case 'messages':
        return this.syncMessageOperation(type, data);
      case 'contexts':
        return this.syncContextOperation(type, data);
      default:
        throw new Error(`Unknown collection: ${collection}`);
    }
  }

  private async syncChatOperation(type: string, data: any) {
    switch (type) {
      case 'create':
        return databaseService.createChat(data.userId, data.name, data.contextIds);
      case 'update':
        return databaseService.updateChat(data.id, data.updates);
      case 'delete':
        return databaseService.deleteChat(data.id);
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  private async syncMessageOperation(type: string, data: any) {
    switch (type) {
      case 'create':
        return databaseService.createMessage(data);
      case 'update':
        return databaseService.updateMessageStatus(data.id, data.status);
      case 'delete':
        return databaseService.deleteMessage(data.id);
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  private async syncContextOperation(type: string, data: any) {
    switch (type) {
      case 'create':
        return databaseService.createContext(data);
      case 'update':
        return databaseService.updateContext(data.id, data.updates);
      case 'delete':
        return databaseService.deleteContext(data.id);
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  handleConflict(local: any, cloud: any): any {
    // Simple last-write-wins strategy
    // Could be enhanced with more sophisticated conflict resolution
    const localTimestamp = new Date(local.updatedAt || local.createdAt).getTime();
    const cloudTimestamp = new Date(cloud.updatedAt || cloud.createdAt).getTime();
    
    return localTimestamp > cloudTimestamp ? local : cloud;
  }

  private loadQueue() {
    try {
      const saved = localStorage.getItem('syncQueue');
      if (saved) {
        this.syncQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSyncQueueStatus() {
    return {
      queueLength: this.syncQueue.length,
      isOnline: this.isOnline,
      isSyncing: this.isSyncing
    };
  }

  clearQueue() {
    this.syncQueue = [];
    this.saveQueue();
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager();