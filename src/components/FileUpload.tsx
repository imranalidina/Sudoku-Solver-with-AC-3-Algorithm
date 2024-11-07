import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { SudokuParser } from '../lib/SudokuParser';

interface FileUploadProps {
  onGridLoad: (grid: number[][]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onGridLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileRead = (e: ProgressEvent<FileReader>) => {
    try {
      setError(null);
      const content = e.target?.result as string;
      const grid = SudokuParser.parse(content);
      onGridLoad(grid);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'csv'].includes(extension || '')) {
      setError('Please upload a .txt or .csv file');
      return;
    }

    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.onerror = () => setError('Error reading file');
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative"
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Load Puzzle
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Supported formats:
        <ul className="list-disc list-inside ml-2 mt-1">
          <li>Text files (.txt) or CSV files (.csv)</li>
          <li>9 lines with 9 numbers each</li>
          <li>Use 0 or . for empty cells</li>
          <li>Numbers can be separated by spaces or commas</li>
          <li>Extra spaces and blank lines are ignored</li>
        </ul>
      </div>
    </div>
  );
};