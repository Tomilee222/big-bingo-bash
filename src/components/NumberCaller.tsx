import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NumberCallerProps {
  currentNumber: number | null;
  previousNumbers: number[];
  className?: string;
}

export const NumberCaller = ({ currentNumber, previousNumbers, className }: NumberCallerProps) => {
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
        <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
          {previousNumbers.slice(-24).map((number, index) => (
            <div
              key={`${number}-${index}`}
              className="aspect-square flex items-center justify-center bg-muted text-muted-foreground text-xs rounded border"
            >
              {number}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {previousNumbers.length} numbers called
        </p>
      </div>
    </div>
  );
};