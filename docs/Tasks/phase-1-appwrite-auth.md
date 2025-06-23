# Phase 1: Appwrite Backend Setup & Authentication

## Execution Command
```bash
claude-code "Execute Phase 1: Appwrite Authentication Setup" /path/to/phase-1-appwrite-auth.md
```

## Objective
Set up Appwrite connection and implement complete authentication system for WhatsFlex.

## Prerequisites
- Appwrite instance running (cloud or self-hosted)
- Project ID and endpoint URL
- API keys configured

## Task Checklist

### 1. Install Dependencies
```bash
npm install appwrite
```

### 2. Create Appwrite Configuration Service
Create `src/services/appwrite/config.ts`:
```typescript
import { Client, Account, Databases, Functions, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export { ID } from 'appwrite';
```

### 3. Create Authentication Service
Create `src/services/appwrite/auth.ts`:
- Implement register(email, password, name)
- Implement login(email, password)
- Implement logout()
- Implement getCurrentUser()
- Implement updateProfile(name, email)
- Implement resetPassword(email)
- Implement confirmReset(userId, secret, password)
- Add session management
- Add error handling with user-friendly messages

### 4. Update AppStore
Modify `src/stores/appStore.ts`:
- Replace mock user with Appwrite user type
- Add auth state: 'loading' | 'authenticated' | 'unauthenticated'
- Implement initAuth() to check current session
- Add login/logout actions using auth service
- Add auth persistence
- Handle auth state changes

### 5. Create Auth Components

#### Login Page (`src/pages/Auth/Login.tsx`)
- Email/password form
- Remember me checkbox
- Forgot password link
- Sign up link
- Loading states
- Error handling
- Redirect after login

#### Register Page (`src/pages/Auth/Register.tsx`)
- Name, email, password fields
- Password confirmation
- Terms acceptance
- Login link
- Email verification notice
- Auto-login after registration

#### Forgot Password (`src/pages/Auth/ForgotPassword.tsx`)
- Email input for reset
- Success message
- Back to login link
- Reset confirmation page

### 6. Create Auth Guard Component
Create `src/components/auth/AuthGuard.tsx`:
```typescript
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
};
```

### 7. Update App Router
Modify `src/NexusApp.tsx`:
- Add public routes (login, register, forgot-password)
- Wrap protected routes with AuthGuard
- Add auth redirect logic
- Handle deep linking after auth

### 8. Create Loading Screen
Create `src/components/ui/LoadingScreen.tsx`:
- Full screen loading indicator
- App logo
- Loading message
- Smooth transitions

### 9. Environment Variables
Create `.env.example`:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
```

### 10. Test Authentication Flow
- Test user registration
- Test email/password login  
- Test logout functionality
- Test session persistence
- Test password reset flow
- Test protected route access
- Test error scenarios

## Acceptance Criteria
- [ ] Users can register with email, password, and name
- [ ] Users can log in with email/password
- [ ] Sessions persist across page refreshes
- [ ] Logout clears session and redirects to login
- [ ] Protected routes redirect unauthenticated users
- [ ] Password reset emails are sent
- [ ] Auth errors show user-friendly messages
- [ ] Loading states display during auth operations
- [ ] Auto-redirect after successful login
- [ ] Remember me functionality works

## Error Handling
Handle these Appwrite auth errors:
- Invalid credentials
- Email already exists
- Weak password
- Invalid session
- Network errors
- Rate limiting

## UI/UX Considerations
- Show password strength indicator
- Add show/hide password toggle
- Implement smooth transitions
- Add social login buttons (prepared for Phase 2)
- Mobile-optimized forms
- Auto-focus first field
- Clear error messages

## Security Considerations
- Implement rate limiting awareness
- No sensitive data in localStorage
- Secure password requirements
- HTTPS only in production
- Session timeout handling
- CSRF protection

## Next Steps
After completing Phase 1:
- Users can create accounts and log in
- App has proper auth state management
- Foundation ready for Phase 2 (Database & Persistence)