import { useState, useEffect } from 'react';
import { BingoCard } from './BingoCard';
import { NumberCaller } from './NumberCaller';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Pause, Play, Users, Volume2, VolumeX } from 'lucide-react';

interface GameDashboardProps {
  playerId: string;
  playerCount: number;
  onGameEnd?: () => void;
  className?: string;
}

export const GameDashboard = ({ playerId, playerCount, onGameEnd, className }: GameDashboardProps) => {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [gameActive, setGameActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [highlightedNumbers, setHighlightedNumbers] = useState<number[]>([]);
  const { toast } = useToast();

  // Simulate automatic number calling
  useEffect(() => {
    if (!gameActive || calledNumbers.length >= 75) return;

    const timer = setTimeout(() => {
      const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
        .filter(num => !calledNumbers.includes(num));
      
      if (availableNumbers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const newNumber = availableNumbers[randomIndex];
        
        setCurrentNumber(newNumber);
        setCalledNumbers(prev => [...prev, newNumber]);
        
        if (!isMuted) {
          // Simulate number announcement
          toast({
            title: `${getLetterForNumber(newNumber)}-${newNumber}`,
            description: "Number called!",
            duration: 3000,
          });
        }
      }
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

    return () => clearTimeout(timer);
  }, [calledNumbers, gameActive, isMuted, toast]);

  const getLetterForNumber = (num: number): string => {
    if (num >= 1 && num <= 15) return 'B';
    if (num >= 16 && num <= 30) return 'I';
    if (num >= 31 && num <= 45) return 'N';
    if (num >= 46 && num <= 60) return 'G';
    if (num >= 61 && num <= 75) return 'O';
    return '';
  };

  const handleNumberClick = (number: number) => {
    setHighlightedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number];
      }
    });
  };

  const handleBingo = () => {
    setWinner(playerId);
    setGameActive(false);
    toast({
      title: "🎉 BINGO! 🎉",
      description: "Congratulations! You won!",
      duration: 10000,
    });
  };

  const toggleGameState = () => {
    setGameActive(!gameActive);
    toast({
      title: gameActive ? "Game Paused" : "Game Resumed",
      description: gameActive ? "Number calling stopped" : "Number calling resumed",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Sound Enabled" : "Sound Muted",
      description: isMuted ? "You'll hear number announcements" : "Number announcements muted",
    });
  };

  const clearHighlights = () => {
    setHighlightedNumbers([]);
    toast({
      title: "Highlights Cleared",
      description: "All number highlights have been cleared",
    });
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">Big Bingo Bash</h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {playerCount} players
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="flex items-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleGameState}
            className="flex items-center gap-2"
          >
            {gameActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {gameActive ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="bg-gradient-to-r from-bingo-winner to-primary text-black p-6 rounded-xl mb-6 text-center animate-winner-celebration">
          <h2 className="text-3xl font-bold mb-2">🎉 BINGO! 🎉</h2>
          <p className="text-lg">
            {winner === playerId ? "You won!" : `Player ${winner} won!`}
          </p>
        </div>
      )}

      {/* Game Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Number Caller - Left Side */}
        <div className="lg:col-span-4">
          <NumberCaller
            currentNumber={currentNumber}
            previousNumbers={calledNumbers}
            onNumberClick={handleNumberClick}
            highlightedNumbers={highlightedNumbers}
            className="sticky top-4"
          />
        </div>

        {/* Bingo Cards - Center */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Player's main card */}
            <BingoCard
              playerId={playerId}
              calledNumbers={calledNumbers}
              highlightedNumbers={highlightedNumbers}
              onCellMark={() => {
                // Check for winning conditions here
                // For demo purposes, we'll simulate a win after 15 numbers
                if (calledNumbers.length >= 15 && !winner) {
                  setTimeout(() => handleBingo(), 1000);
                }
              }}
              className="lg:col-span-1"
            />

            {/* Additional cards for demo */}
            <BingoCard
              playerId="Demo 1"
              calledNumbers={calledNumbers}
              highlightedNumbers={highlightedNumbers}
              className="opacity-75"
            />
            
            <BingoCard
              playerId="Demo 2"
              calledNumbers={calledNumbers}
              highlightedNumbers={highlightedNumbers}
              className="opacity-75"
            />
          </div>

          {/* Game Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={handleBingo}
              className="bg-gradient-to-r from-bingo-winner to-primary text-black hover:from-bingo-winner/90 hover:to-primary/90"
              disabled={!gameActive || winner !== null}
            >
              Call BINGO!
            </Button>
            
            <Button
              variant="outline"
              onClick={clearHighlights}
              disabled={highlightedNumbers.length === 0}
            >
              Clear Highlights
            </Button>
            
            <Button
              variant="outline"
              onClick={onGameEnd}
              disabled={gameActive && !winner}
            >
              End Game
            </Button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{calledNumbers.length}</div>
          <div className="text-sm text-muted-foreground">Numbers Called</div>
        </div>
        
        <div className="bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{75 - calledNumbers.length}</div>
          <div className="text-sm text-muted-foreground">Remaining</div>
        </div>
        
        <div className="bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{highlightedNumbers.length}</div>
          <div className="text-sm text-muted-foreground">Highlighted</div>
        </div>
        
        <div className="bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">
            {gameActive ? "Live" : "Paused"}
          </div>
          <div className="text-sm text-muted-foreground">Game Status</div>
        </div>
      </div>
    </div>
  );
};