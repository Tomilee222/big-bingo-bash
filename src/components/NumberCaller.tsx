import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NumberCallerProps {
  currentNumber: number | null;
  previousNumbers: number[];
  highlightedNumbers?: Set<number>;
  className?: string;
  onNumberClick?: (number: number) => void;
}

export const NumberCaller = ({ currentNumber, previousNumbers, highlightedNumbers = new Set(), className, onNumberClick }: NumberCallerProps) => {
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
            "relative mx-auto w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold",
            "bg-gradient-to-br from-bingo-ball to-white border-4 border-primary shadow-xl",
            isRevealing && "animate-bingo-ball-drop"
          )}>
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
            Mark your cards!
          </p>
        </div>
      )}

      {/* Previous numbers */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Called Numbers</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Click numbers to highlight them
        </p>
        <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
          {previousNumbers.slice(-24).map((number, index) => {
            const isClicked = highlightedNumbers.has(number);
            const isCurrent = number === currentNumber;
            
            return (
              <button
                key={`${number}-${index}`}
                onClick={() => handleNumberClick(number)}
                className={cn(
                  "aspect-square flex items-center justify-center text-xs rounded border transition-all duration-200",
                  "touch-manipulation select-none",
                  "hover:scale-110 hover:shadow-md active:scale-95",
                  isClicked 
                    ? "bg-bingo-marked text-black border-bingo-marked shadow-lg animate-pulse" 
                    : isCurrent
                      ? "bg-bingo-called text-white border-bingo-called animate-number-glow"
                      : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                )}
                title={`${getLetterForNumber(number)}-${number}`}
              >
                {number}
                {isClicked && (
                  <div className="absolute inset-0 rounded border-2 border-bingo-marked opacity-50 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{previousNumbers.length} numbers called</span>
          {highlightedNumbers.size > 0 && (
            <span className="text-primary font-medium">
              {highlightedNumbers.size} highlighted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};