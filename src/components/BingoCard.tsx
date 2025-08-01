import { useState, useEffect, useRef } from 'react';
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
  className?: string;
}

export const BingoCard = ({ playerId, onCellMark, calledNumbers, className }: BingoCardProps) => {
  const [card, setCard] = useState<BingoCell[][]>(() => generateBingoCard());
  const [clickFeedback, setClickFeedback] = useState<{row: number, col: number, type: 'valid' | 'invalid'} | null>(null);
  const [focusedCell, setFocusedCell] = useState<{row: number, col: number} | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
            called: false
          });
        }
      }
      
      grid.push(column);
    }

    return grid;
  }

  // Update called status when calledNumbers changes
  useEffect(() => {
    setCard(prevCard => {
      const newCard = prevCard.map(column => 
        column.map(cell => ({
          ...cell,
          called: cell.number ? calledNumbers.includes(cell.number) : false
        }))
      );
      return newCard;
    });
  }, [calledNumbers]);

  // Clear click feedback after animation
  useEffect(() => {
    if (clickFeedback) {
      const timer = setTimeout(() => setClickFeedback(null), 300);
      return () => clearTimeout(timer);
    }
  }, [clickFeedback]);

  const handleCellClick = (row: number, col: number) => {
    const cell = card[col][row];
    
    // Determine if this is a valid click
    const isValidClick = cell.number && cell.called && !cell.marked;
    
    // Show appropriate click feedback
    setClickFeedback({ row, col, type: isValidClick ? 'valid' : 'invalid' });
    
    // Only allow marking if the number is called and not already marked
    if (!isValidClick) {
      return;
    }

    setCard(prev => {
      const newCard = [...prev];
      newCard[col] = [...newCard[col]];
      newCard[col][row] = { ...newCard[col][row], marked: true };
      return newCard;
    });

    onCellMark?.(row, col);
  };

  const handleCellTouch = (row: number, col: number) => {
    // Handle touch events the same as clicks
    handleCellClick(row, col);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, row: number, col: number) => {
    let newRow = row;
    let newCol = col;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newRow = Math.min(4, row + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newCol = Math.min(4, col + 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleCellClick(row, col);
        return;
      case 'Escape':
        event.preventDefault();
        setFocusedCell(null);
        return;
      default:
        return;
    }

    setFocusedCell({ row: newRow, col: newCol });
    
    // Focus the new cell
    const newButton = cardRef.current?.querySelector(
      `button[data-cell="${newRow}-${newCol}"]`
    ) as HTMLButtonElement;
    newButton?.focus();
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4 shadow-lg", className)}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-primary">BINGO</h3>
        <p className="text-sm text-muted-foreground">Player {playerId}</p>
      </div>
      
      <div ref={cardRef} className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
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
            const hasClickFeedback = clickFeedback?.row === row && clickFeedback?.col === col;
            const feedbackType = clickFeedback?.type;
            const isFocused = focusedCell?.row === row && focusedCell?.col === col;
            
            return (
              <button
                key={`${row}-${col}`}
                data-cell={`${row}-${col}`}
                onClick={() => handleCellClick(row, col)}
                onTouchEnd={() => handleCellTouch(row, col)}
                onKeyDown={(e) => handleKeyDown(e, row, col)}
                onFocus={() => setFocusedCell({ row, col })}
                onBlur={() => setFocusedCell(null)}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm font-medium rounded-lg border-2 transition-all duration-300 select-none",
                  // Base styling based on cell state
                  cell.marked 
                    ? "bg-bingo-marked text-black border-bingo-marked animate-card-mark" 
                    : cell.called 
                      ? "bg-bingo-called text-white border-bingo-called animate-number-glow" 
                      : "bg-card text-card-foreground border-border",
                  // Free space styling
                  isFreeSpace && "bg-accent text-accent-foreground border-accent",
                  // Interactive states
                  isClickable && "cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95",
                  !isClickable && !isFreeSpace && "cursor-default",
                  // Touch feedback animations
                  hasClickFeedback && feedbackType === 'valid' && "animate-touch-feedback",
                  hasClickFeedback && feedbackType === 'invalid' && "animate-invalid-click",
                  // Focus state
                  isFocused && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  // Accessibility
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                )}
                aria-label={
                  isFreeSpace 
                    ? "Free space - already marked" 
                    : `${cell.letter}-${cell.number}${cell.called ? ' - called number' : ' - not called'}${cell.marked ? ' - marked' : ' - not marked'}${isClickable ? ' - press Enter or Space to mark' : ''}`
                }
                aria-pressed={cell.marked}
                aria-describedby={`cell-help-${row}-${col}`}
                tabIndex={row === 2 && col === 2 ? 0 : -1} // Only center cell is initially focusable
              >
                {isFreeSpace ? "FREE" : cell.number}
                <span id={`cell-help-${row}-${col}`} className="sr-only">
                  {isClickable && "Use arrow keys to navigate, Enter or Space to mark"}
                </span>
              </button>
            );
          })
        )}

      </div>
      
      {/* Keyboard instructions */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Use arrow keys to navigate, Enter/Space to mark called numbers
        </p>
      </div>
    </div>
  );
};