import { useState } from 'react';
import { X, ChevronDown, Menu, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartellaBingoProps {
  onExit?: () => void;
  className?: string;
}

export const CartellaBingo = ({ onExit, className }: CartellaBingoProps) => {
  const [currentCall, setCurrentCall] = useState({ letter: 'G', number: 60 });
  const [recentCalls] = useState([
    { letter: 'O', number: 62 },
    { letter: 'I', number: 30 },
    { letter: 'G', number: 57 },
    { letter: 'N', number: 42 }
  ]);
  const [isMuted, setIsMuted] = useState(false);

  // Generate the main bingo board (5x15 grid)
  const generateMainBoard = () => {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I  
      [31, 45],  // N
      [46, 60],  // G
      [61, 75]   // O
    ];

    const board = [];
    for (let row = 0; row < 15; row++) {
      const rowData = [];
      for (let col = 0; col < 5; col++) {
        const [min, max] = ranges[col];
        const number = min + row;
        if (number <= max) {
          rowData.push({
            letter: letters[col],
            number: number,
            called: [3, 11, 30, 42, 57, 58, 60, 62, 71].includes(number) // Sample called numbers from image
          });
        }
      }
      board.push(rowData);
    }
    return board;
  };

  // Generate player card (5x5 grid)
  const generatePlayerCard = () => {
    const playerNumbers = [
      [1, 17, 42, 53, 64],
      [7, 16, 31, 50, 74], 
      [12, 30, null, 46, 63], // null for FREE space
      [10, 24, 35, 60, 70],
      [14, 23, 39, 48, 67]
    ];
    
    return playerNumbers.map((row, rowIndex) => 
      row.map((num, colIndex) => ({
        number: num,
        marked: num === 30 || num === 42, // Sample marked numbers
        isFree: rowIndex === 2 && colIndex === 2
      }))
    );
  };

  const mainBoard = generateMainBoard();
  const playerCard = generatePlayerCard();

  const getNumberStyle = (called: boolean, number: number) => {
    if (!called) return "text-gray-400";
    
    // Color coding based on the image
    if ([3, 11].includes(number)) return "bg-orange-500 text-white rounded-full";
    if ([30, 62, 71].includes(number)) return "bg-red-500 text-white rounded-full";  
    if ([42].includes(number)) return "bg-orange-400 text-white rounded-full";
    if ([57, 58].includes(number)) return "bg-orange-500 text-white rounded-full";
    if ([60].includes(number)) return "bg-green-500 text-white rounded-full";
    
    return "text-white";
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <Button variant="ghost" size="sm" onClick={onExit} className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Cartela Bingo</h1>
          <ChevronDown className="w-5 h-5" />
        </div>
        
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Game Stats */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-4 text-sm">
        <div className="bg-purple-700 px-3 py-1 rounded-full">Call 66</div>
        <div className="bg-blue-600 px-3 py-1 rounded-full flex items-center gap-1">
          <span>Players 30</span>
          <span className="text-xs">👥</span>
        </div>
        <div className="bg-green-600 px-3 py-1 rounded-full">Stake 10</div>
        <div className="bg-teal-600 px-3 py-1 rounded-full flex items-center gap-1">
          <span>Derash 240</span>
          <span className="text-xs">💰</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        <div className="bg-purple-700 px-3 py-1 rounded-full">Game 731143</div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Bonus</Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Bingo Board */}
      <div className="px-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4">
          {/* Letter Headers */}
          <div className="grid grid-cols-5 gap-1 mb-2">
            {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
              <div key={letter} className={cn(
                "text-center font-bold text-lg py-2 rounded",
                index === 0 && "bg-green-500",
                index === 1 && "bg-red-500", 
                index === 2 && "bg-orange-500",
                index === 3 && "bg-blue-500",
                index === 4 && "bg-pink-500"
              )}>
                {letter}
              </div>
            ))}
          </div>

          {/* Number Grid */}
          <div className="space-y-1">
            {mainBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-1">
                {row.map((cell, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "text-center py-1 text-sm font-medium rounded",
                      getNumberStyle(cell.called, cell.number)
                    )}
                  >
                    {cell.number}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Call Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {/* Main current call */}
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white">
            <div className="text-center">
              <div className="text-sm font-bold">{currentCall.letter}</div>
              <div className="text-2xl font-bold">{currentCall.number}</div>
            </div>
          </div>
          
          {/* Recent calls */}
          <div className="absolute -right-16 top-0 flex flex-col gap-1">
            {recentCalls.map((call, index) => (
              <div 
                key={index} 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white",
                  call.letter === 'O' && "bg-pink-500",
                  call.letter === 'I' && "bg-red-500",
                  call.letter === 'G' && "bg-blue-500", 
                  call.letter === 'N' && "bg-orange-500"
                )}
              >
                {call.number}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Letter Buttons */}
      <div className="flex justify-center gap-2 mb-6 px-4">
        {[
          { letter: 'B', color: 'bg-green-500' },
          { letter: 'I', color: 'bg-red-500' },
          { letter: 'N', color: 'bg-orange-500' },
          { letter: 'G', color: 'bg-blue-500' },
          { letter: 'O', color: 'bg-pink-500' }
        ].map(({ letter, color }) => (
          <Button
            key={letter}
            className={cn("w-16 h-16 text-2xl font-bold text-white border-2 border-white rounded-xl", color)}
          >
            {letter}
          </Button>
        ))}
      </div>

      {/* Player Card */}
      <div className="px-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4 max-w-sm mx-auto">
          <div className="grid grid-cols-5 gap-2">
            {playerCard.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm font-bold rounded-lg border-2",
                    cell.isFree 
                      ? "bg-yellow-400 text-black border-yellow-400" 
                      : cell.marked
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-black border-gray-300"
                  )}
                >
                  {cell.isFree ? "★" : cell.number}
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-2 text-lg font-bold">14</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 pb-8">
        <Button 
          onClick={onExit}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-bold"
        >
          Exit
        </Button>
        
        <Button 
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-bold"
        >
          Refresh
        </Button>
        
        <Button 
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full text-lg font-bold"
        >
          BINGO
        </Button>
      </div>
    </div>
  );
};