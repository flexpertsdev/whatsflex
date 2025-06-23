import { databases, appwriteConfig, ID } from '../services/appwrite/config';
import { Permission, Role } from 'appwrite';

// Collection IDs
const COLLECTIONS = {
  CHATS: 'chats',
  MESSAGES: 'messages',
  CONTEXTS: 'contexts'
};

async function setupDatabase() {
  try {
    console.log('Setting up Appwrite database...');
    
    // Create database (if not exists)
    const databaseId = appwriteConfig.databaseId;
    
    // Create Chats collection
    try {
      await databases.createCollection(
        databaseId,
        COLLECTIONS.CHATS,
        'Chats',
        [
          Permission.read(Role.users()),
          Permission.write(Role.users())
        ]
      );
      
      // Add chat attributes
      await databases.createStringAttribute(databaseId, COLLECTIONS.CHATS, 'userId', 255, true);
      await databases.createStringAttribute(databaseId, COLLECTIONS.CHATS, 'name', 255, true);
      await databases.createStringAttribute(databaseId, COLLECTIONS.CHATS, 'lastMessage', 1000, false);
      await databases.createDatetimeAttribute(databaseId, COLLECTIONS.CHATS, 'lastMessageAt', true);
      await databases.createIntegerAttribute(databaseId, COLLECTIONS.CHATS, 'messageCount', true, 0, undefined, 0);
      await databases.createIntegerAttribute(databaseId, COLLECTIONS.CHATS, 'unreadCount', true, 0, undefined, 0);
      await databases.createBooleanAttribute(databaseId, COLLECTIONS.CHATS, 'archived', true, false);
      await databases.createStringAttribute(databaseId, COLLECTIONS.CHATS, 'contextIds', 255, false, undefined, true);
      
      // Create indexes
      await databases.createIndex(databaseId, COLLECTIONS.CHATS, 'userId', 'key', ['userId']);
      await databases.createIndex(databaseId, COLLECTIONS.CHATS, 'lastMessageAt', 'key', ['lastMessageAt'], ['desc']);
      
      console.log('✓ Chats collection created');
    } catch (error: any) {
      if (error.code !== 409) throw error; // 409 = already exists
      console.log('✓ Chats collection already exists');
    }
    
    // Create Messages collection
    try {
      await databases.createCollection(
        databaseId,
        COLLECTIONS.MESSAGES,
        'Messages',
        [
          Permission.read(Role.users()),
          Permission.write(Role.users())
        ]
      );
      
      // Add message attributes
      await databases.createStringAttribute(databaseId, COLLECTIONS.MESSAGES, 'chatId', 255, true);
      await databases.createStringAttribute(databaseId, COLLECTIONS.MESSAGES, 'userId', 255, true);
      await databases.createStringAttribute(databaseId, COLLECTIONS.MESSAGES, 'content', 5000, true);
      await databases.createEnumAttribute(databaseId, COLLECTIONS.MESSAGES, 'role', ['user', 'assistant', 'system'], true);
      await databases.createEnumAttribute(databaseId, COLLECTIONS.MESSAGES, 'status', ['sending', 'sent', 'delivered', 'read', 'failed'], false, 'sent');
      await databases.createStringAttribute(databaseId, COLLECTIONS.MESSAGES, 'attachments', 255, false, undefined, true);
      await databases.createStringAttribute(databaseId, COLLECTIONS.MESSAGES, 'contextIds', 255, false, undefined, true);
      await databases.createDatetimeAttribute(databaseId, COLLECTIONS.MESSAGES, 'createdAt', true);
      await databases.createDatetimeAttribute(databaseId, COLLECTIONS.MESSAGES, 'editedAt', false);
      
      // Create indexes
      await databases.createIndex(databaseId, COLLECTIONS.MESSAGES, 'chatId', 'key', ['chatId']);
      await databases.createIndex(databaseId, COLLECTIONS.MESSAGES, 'createdAt', 'key', ['createdAt'], ['desc']);
      
      console.log('✓ Messages collection created');
    } catch (error: any) {
      if (error.code !== 409) throw error;
      console.log('✓ Messages collection already exists');
    }
    
    // Create Contexts collection
    try {
      await databases.createCollection(
        databaseId,
        COLLECTIONS.CONTEXTS,
        'Contexts',
        [
          Permission.read(Role.users()),
          Permission.write(Role.users())
        ]
      );
      
      // Add context attributes
      await databases.createStringAttribute(databaseId, COLLECTIONS.CONTEXTS, 'userId', 255, true);
      await databases.createStringAttribute(databaseId, COLLECTIONS.CONTEXTS, 'title', 255, true);
      await databases.createStringAttribute(databaseId, COLLECTIONS.CONTEXTS, 'content', 10000, true);
      await databases.createEnumAttribute(
        databaseId, 
        COLLECTIONS.CONTEXTS, 
        'category', 
        ['development', 'architecture', 'documentation', 'reference', 'planning'], 
        true,
        'documentation'
      );
      await databases.createStringAttribute(databaseId, COLLECTIONS.CONTEXTS, 'tags', 100, false, undefined, true);
      await databases.createBooleanAttribute(databaseId, COLLECTIONS.CONTEXTS, 'isFavorite', true, false);
      await databases.createIntegerAttribute(databaseId, COLLECTIONS.CONTEXTS, 'usageCount', true, 0, undefined, 0);
      await databases.createDatetimeAttribute(databaseId, COLLECTIONS.CONTEXTS, 'lastUsedAt', false);
      await databases.createStringAttribute(databaseId, COLLECTIONS.CONTEXTS, 'metadata', 2000, false, '{}');
      
      // Create indexes
      await databases.createIndex(databaseId, COLLECTIONS.CONTEXTS, 'userId', 'key', ['userId']);
      await databases.createIndex(databaseId, COLLECTIONS.CONTEXTS, 'category', 'key', ['category']);
      await databases.createIndex(databaseId, COLLECTIONS.CONTEXTS, 'isFavorite', 'key', ['isFavorite']);
      await databases.createIndex(databaseId, COLLECTIONS.CONTEXTS, 'usageCount', 'key', ['usageCount'], ['desc']);
      
      console.log('✓ Contexts collection created');
    } catch (error: any) {
      if (error.code !== 409) throw error;
      console.log('✓ Contexts collection already exists');
    }
    
    console.log('\n✅ Database setup complete!');
    console.log('\nNext steps:');
    console.log('1. Create storage buckets in Appwrite console:');
    console.log('   - attachments (for message attachments)');
    console.log('   - voice-messages (for audio messages)');
    console.log('   - avatars (for user avatars)');
    console.log('2. Configure Appwrite Functions for AI integration (Phase 3)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setupDatabase };