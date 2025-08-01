import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, Play, Clock, Trophy } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  joinedAt: Date;
}

interface GameLobbyProps {
  onStartGame: () => void;
  currentPlayers: Player[];
  maxPlayers: number;
  gameStatus: 'waiting' | 'starting' | 'in-progress' | 'finished';
  className?: string;
}

export const GameLobby = ({ 
  onStartGame, 
  currentPlayers, 
  maxPlayers, 
  gameStatus, 
  className 
}: GameLobbyProps) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (gameStatus === 'starting' && countdown === null) {
      setCountdown(10);
    }
  }, [gameStatus, countdown]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onStartGame();
      setCountdown(null);
    }
  }, [countdown, onStartGame]);

  const readyPlayers = currentPlayers.filter(player => player.isReady).length;
  const canStart = currentPlayers.length >= 2 && readyPlayers === currentPlayers.length;

  return (
    <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Big Bingo Bash
        </h1>
        <p className="text-muted-foreground">
          75-Ball Multiplayer Bingo Game
        </p>
      </div>

      {/* Game Status */}
      <div className="bg-secondary rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Players</span>
            <Badge variant="secondary">
              {currentPlayers.length}/{maxPlayers}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {gameStatus === 'waiting' && (
              <Badge variant="outline" className="text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Waiting
              </Badge>
            )}
            {gameStatus === 'starting' && countdown !== null && (
              <Badge variant="default" className="animate-pulse">
                <Play className="w-3 h-3 mr-1" />
                Starting in {countdown}s
              </Badge>
            )}
            {gameStatus === 'in-progress' && (
              <Badge variant="default" className="animate-number-glow">
                <Play className="w-3 h-3 mr-1" />
                In Progress
              </Badge>
            )}
            {gameStatus === 'finished' && (
              <Badge variant="default">
                <Trophy className="w-3 h-3 mr-1" />
                Finished
              </Badge>
            )}
          </div>
        </div>

        {countdown !== null && (
          <div className="text-center">
            <div className="text-4xl font-bold text-primary animate-bingo-ball-drop">
              {countdown}
            </div>
            <p className="text-sm text-muted-foreground">Get ready!</p>
          </div>
        )}
      </div>

      {/* Player List */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Current Players
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {currentPlayers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No players yet. Be the first to join!
            </p>
          ) : (
            currentPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-muted rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>
                <Badge 
                  variant={player.isReady ? "default" : "secondary"}
                  className={player.isReady ? "animate-number-glow" : ""}
                >
                  {player.isReady ? "Ready" : "Not Ready"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="space-y-3">
        {gameStatus === 'waiting' && (
          <>
            <Button 
              onClick={() => {/* Handle ready toggle */}}
              variant="outline"
              className="w-full"
            >
              Mark as Ready
            </Button>
            
            {canStart && (
              <Button 
                onClick={() => setCountdown(10)}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            )}
            
            {!canStart && (
              <p className="text-sm text-muted-foreground text-center">
                Need at least 2 players with all players ready to start
              </p>
            )}
          </>
        )}

        {gameStatus === 'finished' && (
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            New Game
          </Button>
        )}
      </div>

      {/* Game Rules */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2 text-sm">Game Rules</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• 75-ball bingo with 5x5 cards</li>
          <li>• Mark numbers as they're called</li>
          <li>• First to complete a line wins!</li>
          <li>• Lines can be horizontal, vertical, or diagonal</li>
        </ul>
      </div>
    </div>
  );
};