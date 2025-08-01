# Big Bingo Bash

A modern, interactive bingo game built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Interactive Number Calling
- **Click & Touch Support**: Players can click or touch called numbers in the Number Caller panel
- **Visual Highlighting**: Clicked numbers are highlighted with a golden background and pulse animation
- **Cross-Reference**: When you click a number in the Number Caller, corresponding cells on your bingo cards are highlighted with a neon ring
- **Touch-Friendly**: Optimized for both desktop and mobile devices with touch-manipulation CSS

### 🎮 Game Features
- **Real-time Number Calling**: Automatic number calling with customizable intervals
- **Multiple Bingo Cards**: Support for multiple players with individual cards
- **Visual Feedback**: Rich animations and visual effects for game interactions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎨 Visual Enhancements
- **Animated Number Balls**: Current number displays with drop-in animation
- **Glowing Effects**: Called numbers glow with neon effects
- **Marked Cells**: Clicked bingo cells animate with scale and color changes
- **Highlighted Numbers**: Clicked numbers in the caller show pulse animations

## How to Play

1. **Start the Game**: The game automatically begins calling numbers
2. **Click Called Numbers**: In the Number Caller panel, click on any called number to highlight it
3. **Mark Your Cards**: Click on matching numbers on your bingo cards to mark them
4. **Visual Feedback**: Highlighted numbers in the caller will show corresponding highlights on your cards
5. **Call BINGO**: When you have a winning pattern, click the "Call BINGO!" button

## Technical Features

- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling with custom animations
- **Shadcn/ui** components for consistent UI
- **Responsive Design** with mobile-first approach
- **Touch Optimized** with proper touch event handling
- **State Management** with React hooks for game state

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Game Controls

- **Pause/Resume**: Control the automatic number calling
- **Mute/Unmute**: Toggle sound notifications
- **Number Highlighting**: Click any called number to highlight it
- **Card Marking**: Click on called numbers on your cards to mark them

## Mobile Support

The game is fully optimized for mobile devices with:
- Touch-friendly button sizes
- Responsive grid layouts
- Optimized animations for mobile performance
- Proper touch event handling

Enjoy playing Big Bingo Bash! 🎉
