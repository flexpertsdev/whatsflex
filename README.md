# WhatsFlex

A modern, AI-powered chat application built with React, TypeScript, Tailwind CSS, and Appwrite. Features a WhatsApp-style UI with full PWA support.

## Features

- 🎨 Modern, responsive UI with adaptive layouts for mobile, tablet, and desktop
- 📱 Progressive Web App (PWA) with offline support
- 💬 WhatsApp-style chat interface
- 🎯 Context management for AI conversations
- 🔐 Secure authentication with Appwrite
- 🎨 Beautiful green theme with Quicksand font
- ⚡ Built with Vite for fast development

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Framer Motion, Lucide Icons
- **Backend**: Appwrite
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa with Workbox

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An Appwrite account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsflex.git
cd whatsflex
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Appwrite configuration:
- `VITE_APPWRITE_ENDPOINT`: Your Appwrite endpoint
- `VITE_APPWRITE_PROJECT_ID`: Your Appwrite project ID

4. Set up Appwrite collections and buckets as specified in `.env.example`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Appwrite Setup

Create the following in your Appwrite project:

### Database
- Create a database with ID: `main`

### Collections
1. **chats**: Store chat conversations
2. **messages**: Store chat messages
3. **contexts**: Store AI context data
4. **users**: Store user profiles

### Storage Buckets
1. **attachments**: For message attachments
2. **avatars**: For user profile pictures

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Deployment

The app is configured as a PWA and can be deployed to any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

Popular options:
- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details