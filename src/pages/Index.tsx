import { useState } from 'react';
import { GameLobby } from '@/components/GameLobby';
import { GameDashboard } from '@/components/GameDashboard';

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  joinedAt: Date;
}

const Index = () => {
  const [gameState, setGameState] = useState<'lobby' | 'playing'>('lobby');
  const [currentPlayers] = useState<Player[]>([
    { id: '1', name: 'You', isReady: true, joinedAt: new Date() },
    { id: '2', name: 'Alice', isReady: true, joinedAt: new Date(Date.now() - 60000) },
    { id: '3', name: 'Bob', isReady: true, joinedAt: new Date(Date.now() - 120000) },
    { id: '4', name: 'Charlie', isReady: true, joinedAt: new Date(Date.now() - 180000) },
  ]);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleEndGame = () => {
    setGameState('lobby');
  };

  if (gameState === 'playing') {
    return (
      <GameDashboard
        playerId="1"
        playerCount={currentPlayers.length}
        onGameEnd={handleEndGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto">
        <GameLobby
          onStartGame={handleStartGame}
          currentPlayers={currentPlayers}
          maxPlayers={100}
          gameStatus="waiting"
        />
      </div>
    </div>
  );
};

export default Index;
