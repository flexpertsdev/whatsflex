import { account, ID } from './config';
import type { Models } from 'appwrite';
import { AppwriteException } from 'appwrite';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: Record<string, any>;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      // Create the account
      const user = await account.create(ID.unique(), email, password, name);
      
      // Create a session (auto-login)
      await account.createEmailPasswordSession(email, password);
      
      // Return user data
      return this.mapUser(user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('Failed to get user after login');
      }
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get the currently logged in user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await account.get();
      return this.mapUser(user);
    } catch (error) {
      // If error is 401, user is not logged in
      if (error instanceof AppwriteException && error.code === 401) {
        return null;
      }
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(name?: string, email?: string): Promise<AuthUser> {
    try {
      if (name) {
        await account.updateName(name);
      }
      if (email) {
        await account.updateEmail(email, await this.promptPassword());
      }
      return this.getCurrentUser() as Promise<AuthUser>;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, resetUrl);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(
    userId: string,
    secret: string,
    password: string
  ): Promise<void> {
    try {
      await account.updateRecovery(userId, secret, password);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user password
   */
  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get all user sessions
   */
  async getSessions(): Promise<Models.Session[]> {
    try {
      const sessions = await account.listSessions();
      return sessions.sessions;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Delete a specific session
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await account.deleteSession(sessionId);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(prefs: Record<string, any>): Promise<AuthUser> {
    try {
      await account.updatePrefs(prefs);
      return this.getCurrentUser() as Promise<AuthUser>;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Map Appwrite user to our AuthUser interface
   */
  private mapUser(user: Models.User<Models.Preferences>): AuthUser {
    return {
      id: user.$id,
      email: user.email,
      name: user.name,
      emailVerification: user.emailVerification,
      phoneVerification: user.phoneVerification,
      prefs: user.prefs,
    };
  }

  /**
   * Handle authentication errors with user-friendly messages
   */
  private handleAuthError(error: any): Error {
    if (error instanceof AppwriteException) {
      switch (error.code) {
        case 401:
          return new Error('Invalid email or password');
        case 409:
          return new Error('An account with this email already exists');
        case 429:
          return new Error('Too many attempts. Please try again later');
        case 400:
          if (error.message.includes('password')) {
            return new Error('Password must be at least 8 characters');
          }
          if (error.message.includes('email')) {
            return new Error('Please enter a valid email address');
          }
          return new Error('Invalid input. Please check your information');
        default:
          return new Error(error.message || 'An error occurred during authentication');
      }
    }
    return new Error('An unexpected error occurred. Please try again');
  }

  /**
   * Prompt for password (used for email updates)
   * In a real app, this would show a modal
   */
  private async promptPassword(): Promise<string> {
    // This is a placeholder - in the real app, show a password prompt modal
    const password = prompt('Please enter your password to confirm this change:');
    if (!password) {
      throw new Error('Password is required to update email');
    }
    return password;
  }
}

// Export singleton instance
export const authService = new AuthService();