import { account } from './appwrite';
import { AppwriteException, ID } from 'appwrite';

export class AuthService {
  // Get current user
  static async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      return user;
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  // Sign out
  static async signOut() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(name?: string, password?: string) {
    try {
      if (name) {
        await account.updateName(name);
      }
      if (password) {
        await account.updatePassword(password);
      }
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  // Send password recovery email
  static async recoverPassword(email: string) {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      return await account.createRecovery(email, redirectUrl);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  // Complete password recovery
  static async resetPassword(userId: string, secret: string, password: string) {
    try {
      return await account.updateRecovery(userId, secret, password);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}