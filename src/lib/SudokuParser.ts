export class SudokuParser {
  static parse(content: string): number[][] {
    // Remove any comments (lines starting with #)
    const cleanContent = content
      .split('\n')
      .filter(line => !line.trim().startsWith('#'))
      .join('\n');

    // Split into lines and clean them
    const lines = cleanContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0); // Remove empty lines

    if (lines.length !== 9) {
      throw new Error('Invalid puzzle: must contain exactly 9 rows');
    }

    const grid: number[][] = [];

    for (const line of lines) {
      // Replace dots with zeros and remove any non-digit characters
      const cleanLine = line.replace(/\./g, '0').replace(/[^0-9]/g, '');
      
      if (cleanLine.length !== 9) {
        throw new Error('Invalid row: must contain exactly 9 numbers');
      }

      const row = cleanLine.split('').map(char => parseInt(char, 10));
      
      // Validate numbers are between 0-9
      if (!row.every(num => num >= 0 && num <= 9)) {
        throw new Error('Invalid numbers: must be between 0 and 9');
      }

      grid.push(row);
    }

    // Validate initial grid state
    if (!this.isValidInitialGrid(grid)) {
      throw new Error('Invalid puzzle: contains duplicate numbers in row, column, or box');
    }

    return grid;
  }

  private static isValidInitialGrid(grid: number[][]): boolean {
    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col];
        if (value !== 0) {
          if (seen.has(value)) return false;
          seen.add(value);
        }
      }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const value = grid[row][col];
        if (value !== 0) {
          if (seen.has(value)) return false;
          seen.add(value);
        }
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set<number>();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const value = grid[boxRow * 3 + i][boxCol * 3 + j];
            if (value !== 0) {
              if (seen.has(value)) return false;
              seen.add(value);
            }
          }
        }
      }
    }

    return true;
  }
}