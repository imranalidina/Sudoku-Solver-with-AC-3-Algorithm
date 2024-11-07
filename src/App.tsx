import React, { useState } from 'react';
import { SudokuBoard } from './components/SudokuBoard';
import { SudokuSolver } from './lib/SudokuSolver';
import { FileUpload } from './components/FileUpload';
import { Upload, Brain, RotateCcw } from 'lucide-react';

function App() {
  const [grid, setGrid] = useState<number[][]>(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [queueLength, setQueueLength] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);
  const [solving, setSolving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const solver = new SudokuSolver();

  const handleSolve = () => {
    try {
      setSolving(true);
      setError('');
      const result = solver.solve(grid, (ql) => setQueueLength(ql));
      if (result.success) {
        setGrid(result.grid);
        setSolved(true);
      } else {
        setError('No solution exists for this puzzle');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSolving(false);
    }
  };

  const handleReset = () => {
    setGrid(Array(9).fill(null).map(() => Array(9).fill(0)));
    setSolved(false);
    setQueueLength(0);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sudoku Solver</h1>
          <p className="text-gray-600">Using AC-3 Algorithm with CSP</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <SudokuBoard grid={grid} onCellChange={(row, col, value) => {
            const newGrid = [...grid];
            newGrid[row][col] = value;
            setGrid(newGrid);
            setSolved(false);
          }} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center mb-6">
          <FileUpload onGridLoad={setGrid} />
          
          <div className="flex gap-3">
            <button
              onClick={handleSolve}
              disabled={solving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Brain className="w-5 h-5" />
              {solving ? 'Solving...' : 'Solve'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {queueLength > 0 && !solved && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-4">
            AC-3 Queue Length: {queueLength}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {solved && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
            Puzzle solved successfully!
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Team Members</h2>
          <div className="space-y-2 text-center">
            <h3 className="font-bold text-lg mb-2">Group 12:</h3>
            <p>Imran Alidina - 190561200 - alid1200@mylaurier.ca</p>
            <p>Adnan Awan - 169026101 - awan6101@mylaurier.ca</p>
            <p>Anay Varma - 169029594 - varm9594@mylaurier.ca</p>
            <p>Aarez Siddiqui - 169026056 - sidd6056@mylaurier.ca</p>
            <p>Daniel Ngo - 190624010 - ngox4010@mylaurier.ca</p>
            <p>Jacob Kizhakkedan - 210294050 - kizh4050@mylaurier.ca</p>
            <p>Jason Van Humbeck - 169021575 - vanh1575@mylaurier.ca</p>
            <p>Jasnoor Bains - 210427770 - bain7770@mylaurier.ca</p>
            <p>Miles Rose-Mighty - 210710070 - rose0070@mylaurier.ca</p>
            <p>Sirtaj Khroud - 190638790 - khro8790@mylaurier.ca</p>
            <p>Luca Horta - hort3700@mylaurier.ca</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;