#!/bin/bash

# WhatsFlex Build Plan Executor
# This script helps execute different phases of the build plan

echo "🚀 WhatsFlex Build Plan Executor"
echo "================================"

# Check if phase number is provided
if [ -z "$1" ]; then
    echo "Usage: ./execute-build-phase.sh <phase-number>"
    echo ""
    echo "Available Phases:"
    echo "  1 - Appwrite Backend Setup & Authentication"
    echo "  2 - Database Schema & Chat Persistence"
    echo "  3 - AI Integration via Appwrite Functions"
    echo "  4 - Enhanced Messaging Features"
    echo "  5 - Progressive Web App Features"
    echo "  6 - User Experience Polish"
    echo "  7 - Advanced AI Features"
    echo "  8 - Production Readiness"
    echo ""
    echo "Example: ./execute-build-phase.sh 1"
    exit 1
fi

PHASE=$1
DOCS_PATH="$(pwd)/docs"

case $PHASE in
    1)
        echo "📱 Executing Phase 1: Appwrite Backend Setup & Authentication"
        echo "This will set up authentication and user management..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 1: Appwrite Authentication Setup from the build plan\" \"$DOCS_PATH/Tasks/phase-1-appwrite-auth.md\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    2)
        echo "💾 Executing Phase 2: Database Schema & Chat Persistence"
        echo "This will implement data persistence with Appwrite Database..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 2: Database Schema & Chat Persistence from the build plan\" \"$DOCS_PATH/Tasks/phase-2-database-persistence.md\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    3)
        echo "🤖 Executing Phase 3: AI Integration via Appwrite Functions"
        echo "This will connect Claude AI through Appwrite Functions..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 3: AI Integration from the build plan\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    4)
        echo "💬 Executing Phase 4: Enhanced Messaging Features"
        echo "This will add voice messages, file sharing, and search..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 4: Enhanced Messaging Features from the build plan\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    5)
        echo "📱 Executing Phase 5: Progressive Web App Features"
        echo "This will add push notifications and offline support..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 5: PWA Features from the build plan\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    6)
        echo "✨ Executing Phase 6: User Experience Polish"
        echo "This will add onboarding, themes, and accessibility..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 6: UX Polish from the build plan\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    7)
        echo "🧠 Executing Phase 7: Advanced AI Features"
        echo "This will add multi-model support and smart features..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 7: Advanced AI Features from the build plan\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    8)
        echo "🚀 Executing Phase 8: Production Readiness"
        echo "This will prepare the app for production deployment..."
        echo ""
        echo "Run this command:"
        echo "claude-code \"Execute Phase 8: Production Readiness from the build plan\" \"$DOCS_PATH/BUILD_PLAN.md\""
        ;;
    *)
        echo "❌ Invalid phase number: $PHASE"
        echo "Please choose a phase between 1 and 8"
        exit 1
        ;;
esac

echo ""
echo "📝 Phase Details:"
echo "- Each phase builds on the previous one"
echo "- Complete all tasks in order"
echo "- Test thoroughly before moving to next phase"
echo "- Commit changes after each phase"
echo ""
echo "Need the full plan? Check: $DOCS_PATH/BUILD_PLAN.md"