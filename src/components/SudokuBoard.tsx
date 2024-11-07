import React from 'react';

interface SudokuBoardProps {
  grid: number[][];
  onCellChange: (row: number, col: number, value: number) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({ grid, onCellChange }) => {
  const handleChange = (row: number, col: number, value: string) => {
    const num = value === '' ? 0 : parseInt(value.slice(-1));
    if ((num >= 0 && num <= 9) || value === '') {
      onCellChange(row, col, num);
    }
  };

  return (
    <div className="grid grid-cols-9 gap-px bg-gray-300 p-px">
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <input
            key={`${i}-${j}`}
            type="text"
            value={cell === 0 ? '' : cell}
            onChange={(e) => handleChange(i, j, e.target.value)}
            className={`
              w-full aspect-square text-center text-lg font-medium bg-white
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${(i + 1) % 3 === 0 && i < 8 ? 'border-b-2 border-gray-400' : ''}
              ${(j + 1) % 3 === 0 && j < 8 ? 'border-r-2 border-gray-400' : ''}
            `}
          />
        ))
      )}
    </div>
  );
};