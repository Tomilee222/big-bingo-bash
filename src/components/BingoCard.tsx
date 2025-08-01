import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BingoCell {
  letter: string;
  number: number | null;
  marked: boolean;
  called: boolean;
}

interface BingoCardProps {
  playerId: string;
  onCellMark?: (row: number, col: number) => void;
  calledNumbers: number[];
  highlightedNumbers?: Set<number>;
  className?: string;
}

export const BingoCard = ({ playerId, onCellMark, calledNumbers, highlightedNumbers = new Set(), className }: BingoCardProps) => {
  const [card, setCard] = useState<BingoCell[][]>(() => generateBingoCard());

  function generateBingoCard(): BingoCell[][] {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I
      [31, 45],  // N
      [46, 60],  // G
      [61, 75]   // O
    ];

    const grid: BingoCell[][] = [];

    for (let col = 0; col < 5; col++) {
      const column: BingoCell[] = [];
      const [min, max] = ranges[col];
      const usedNumbers = new Set<number>();

      for (let row = 0; row < 5; row++) {
        if (row === 2 && col === 2) {
          // Center free space
          column.push({
            letter: letters[col],
            number: null,
            marked: true,
            called: false
          });
        } else {
          let number: number;
          do {
            number = Math.floor(Math.random() * (max - min + 1)) + min;
          } while (usedNumbers.has(number));
          
          usedNumbers.add(number);
          column.push({
            letter: letters[col],
            number,
            marked: false,
            called: calledNumbers.includes(number)
          });
        }
      }
      
      grid.push(column);
    }

    return grid;
  }

  // Update card when called numbers change
  useEffect(() => {
    setCard(prev => {
      const newCard = prev.map(column =>
        column.map(cell => ({
          ...cell,
          called: cell.number ? calledNumbers.includes(cell.number) : false
        }))
      );
      return newCard;
    });
  }, [calledNumbers]);

  const handleCellClick = (row: number, col: number) => {
    const cell = card[col][row];
    if (!cell.number || !cell.called) return;

    setCard(prev => {
      const newCard = [...prev];
      newCard[col] = [...newCard[col]];
      newCard[col][row] = { ...newCard[col][row], marked: !newCard[col][row].marked };
      return newCard;
    });

    onCellMark?.(row, col);
  };

  // Check if a number is currently highlighted in the number caller
  const isNumberHighlighted = (number: number | null) => {
    if (!number) return false;
    return highlightedNumbers.has(number);
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4 shadow-lg", className)}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-primary">BINGO</h3>
        <p className="text-sm text-muted-foreground">Player {playerId}</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
        {/* Header row */}
        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
          <div 
            key={letter} 
            className="aspect-square flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg rounded-lg"
          >
            {letter}
          </div>
        ))}
        
        {/* Bingo grid */}
        {Array.from({ length: 5 }, (_, row) => 
          Array.from({ length: 5 }, (_, col) => {
            const cell = card[col][row];
            const isFreeSpace = row === 2 && col === 2;
            const isClickable = cell.called && cell.number && !cell.marked;
            const isHighlighted = isNumberHighlighted(cell.number);
            
            return (
              <button
                key={`${row}-${col}`}
                onClick={() => handleCellClick(row, col)}
                disabled={!isClickable && !isFreeSpace}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm font-medium rounded-lg border-2 transition-all duration-300",
                  "touch-manipulation select-none",
                  cell.marked 
                    ? "bg-bingo-marked text-black border-bingo-marked animate-card-mark" 
                    : cell.called 
                      ? "bg-bingo-called text-white border-bingo-called animate-number-glow" 
                      : "bg-card text-card-foreground border-border hover:border-primary/50",
                  isClickable && "cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95",
                  isHighlighted && !cell.marked && "ring-2 ring-bingo-neon ring-opacity-75 shadow-lg",
                  isFreeSpace && "bg-accent text-accent-foreground border-accent"
                )}
                title={cell.number ? `${cell.letter}-${cell.number}` : "FREE SPACE"}
              >
                {isFreeSpace ? "FREE" : cell.number}
                {isHighlighted && !cell.marked && (
                  <div className="absolute inset-0 rounded-lg bg-bingo-neon opacity-20 animate-pulse" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};