import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NumberCallerProps {
  currentNumber: number | null;
  previousNumbers: number[];
  onNumberClick?: (number: number) => void;
  highlightedNumbers?: number[];
  className?: string;
}

export const NumberCaller = ({ 
  currentNumber, 
  previousNumbers, 
  onNumberClick,
  highlightedNumbers = [],
  className 
}: NumberCallerProps) => {
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (currentNumber) {
      setIsRevealing(true);
      const timer = setTimeout(() => setIsRevealing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [currentNumber]);

  const getLetterForNumber = (num: number): string => {
    if (num >= 1 && num <= 15) return 'B';
    if (num >= 16 && num <= 30) return 'I';
    if (num >= 31 && num <= 45) return 'N';
    if (num >= 46 && num <= 60) return 'G';
    if (num >= 61 && num <= 75) return 'O';
    return '';
  };

  const handleNumberClick = (number: number) => {
    onNumberClick?.(number);
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 text-center", className)}>
      <h2 className="text-2xl font-bold text-primary mb-6">Number Caller</h2>
      
      {/* Current number display */}
      <div className="mb-8">
        {currentNumber ? (
          <div className={cn(
            "relative mx-auto w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold cursor-pointer transition-all duration-300 hover:scale-105",
            "bg-gradient-to-br from-bingo-ball to-white border-4 border-primary shadow-xl",
            isRevealing && "animate-bingo-ball-drop",
            highlightedNumbers.includes(currentNumber) && "ring-4 ring-bingo-neon ring-opacity-50"
          )}
          onClick={() => handleNumberClick(currentNumber)}
          >
            <div className="text-center">
              <div className="text-primary text-lg font-bold">
                {getLetterForNumber(currentNumber)}
              </div>
              <div className="text-black text-2xl">
                {currentNumber}
              </div>
            </div>
            {isRevealing && (
              <div className="absolute inset-0 rounded-full bg-bingo-neon opacity-30 animate-ping" />
            )}
          </div>
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-dashed border-muted flex items-center justify-center text-muted-foreground">
            <span className="text-sm">Waiting...</span>
          </div>
        )}
      </div>

      {/* Call announcement */}
      {currentNumber && (
        <div className="mb-6">
          <p className="text-xl font-semibold text-foreground animate-fade-in">
            {getLetterForNumber(currentNumber)}-{currentNumber}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click numbers to highlight matches!
          </p>
        </div>
      )}

      {/* Previous numbers */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Called Numbers</h3>
        <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
          {previousNumbers.slice(-24).map((number, index) => (
            <button
              key={`${number}-${index}`}
              onClick={() => handleNumberClick(number)}
              className={cn(
                "aspect-square flex items-center justify-center text-xs rounded border transition-all duration-200 hover:scale-105 cursor-pointer",
                highlightedNumbers.includes(number)
                  ? "bg-bingo-neon text-white border-bingo-neon shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:border-primary/50"
              )}
            >
              {number}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {previousNumbers.length} numbers called • Click to highlight
        </p>
      </div>
    </div>
  );
};