# WhatsFlex Project Overview

## 🎯 Project Vision

WhatsFlex is a modern, WhatsApp-style chat application with AI-powered context management. It combines familiar messaging interfaces with advanced AI capabilities to create intelligent, context-aware conversations.

## 🏗️ Architecture Overview

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Tailwind CSS + Framer Motion
- **State Management**: Zustand stores
- **Local Storage**: IndexedDB via Dexie.js
- **Build Tool**: Vite
- **Deployment**: Netlify

### Backend Architecture (In Migration)
- **Current**: Migrating from Supabase to Appwrite
- **AI Service**: Anthropic Claude API
- **Authentication**: Appwrite Auth
- **Database**: Appwrite Database
- **Functions**: Appwrite Functions (replacing Supabase Edge Functions)
- **Storage**: Appwrite Storage

## 🎨 Key Features

### 1. Chat System
- WhatsApp-style interface
- Real-time messaging
- Message status indicators (sending, sent, delivered, read)
- Rich message composer with attachments
- Mobile-first responsive design

### 2. Context Management
- Create reusable knowledge contexts
- Select contexts to enhance AI responses
- Track context usage and effectiveness
- AI-generated context suggestions
- Context categories and tagging

### 3. AI Integration
- Powered by Anthropic Claude
- Context-aware responses
- Transparent AI thinking process
- Confidence levels and reasoning steps
- Smart context recommendations

### 4. Adaptive UI
- Automatic layout switching (mobile/tablet/desktop)
- Bottom sheets for mobile
- Sidebars for desktop
- Touch-optimized interactions
- Safe area handling

## 📁 Project Structure

```
vite-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ai/          # AI-related components
│   │   ├── chat/        # Chat UI components
│   │   ├── context/     # Context management UI
│   │   └── ui/          # Base UI components
│   ├── config/          # Configuration files
│   ├── layouts/         # Responsive layout components
│   ├── pages/           # Page components
│   ├── services/        # Backend service integrations
│   ├── stores/          # Zustand state stores
│   └── utils/           # Utility functions
├── docs/                # Project documentation
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🚀 Current Status

### ✅ Completed
- Frontend UI implementation
- Responsive design system
- Chat interface
- Context selection UI
- Local data persistence

### 🚧 In Progress
- Appwrite backend integration
- Authentication setup
- Cloud function migration
- Real-time features

### 📋 Planned
- Message synchronization
- File upload support
- Voice messages
- Group chats
- Advanced context analytics

## 🔧 Technology Decisions

### Why Appwrite?
- Self-hostable option
- Comprehensive SDK
- Built-in authentication
- Real-time subscriptions
- Good developer experience

### Why Zustand?
- Simple and lightweight
- TypeScript support
- No boilerplate
- Great DevTools
- Easy persistence

### Why IndexedDB?
- Offline-first approach
- Large storage capacity
- Better performance
- Transaction support
- Browser native

## 🎯 Design Principles

1. **Mobile-First**: Designed primarily for mobile with progressive enhancement
2. **Context-Aware**: Every interaction considers available contexts
3. **Transparent AI**: Show AI's thinking process to build trust
4. **Local-First**: Work offline, sync when online
5. **Familiar UX**: WhatsApp-inspired for immediate familiarity

## 🔄 Migration Strategy

Currently migrating from Supabase to Appwrite:
1. Implement Appwrite authentication
2. Create cloud functions for AI integration
3. Set up database collections
4. Implement real-time subscriptions
5. Migrate existing data

See [APPWRITE_MIGRATION.md](./APPWRITE_MIGRATION.md) for detailed migration plan.