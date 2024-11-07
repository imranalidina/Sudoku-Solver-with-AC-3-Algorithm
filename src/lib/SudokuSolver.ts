export class SudokuSolver {
  private domains: Set<number>[][][];
  private arcs: [number, number, number, number][];

  constructor() {
    this.domains = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() =>
        new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
      )
    );
    this.arcs = this.generateArcs();
  }

  private generateArcs(): [number, number, number, number][] {
    const arcs: [number, number, number, number][] = [];
    
    // Generate row constraints
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        for (let col2 = col + 1; col2 < 9; col2++) {
          arcs.push([row, col, row, col2]);
          arcs.push([row, col2, row, col]);
        }
      }
    }

    // Generate column constraints
    for (let col = 0; col < 9; col++) {
      for (let row = 0; row < 9; row++) {
        for (let row2 = row + 1; row2 < 9; row2++) {
          arcs.push([row, col, row2, col]);
          arcs.push([row2, col, row, col]);
        }
      }
    }

    // Generate 3x3 box constraints
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const cells: [number, number][] = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            cells.push([boxRow * 3 + i, boxCol * 3 + j]);
          }
        }
        for (let i = 0; i < cells.length; i++) {
          for (let j = i + 1; j < cells.length; j++) {
            arcs.push([...cells[i], ...cells[j]]);
            arcs.push([...cells[j], ...cells[i]]);
          }
        }
      }
    }

    return arcs;
  }

  private revise(xi: [number, number], xj: [number, number]): boolean {
    let revised = false;
    const [i, j] = xi;
    const [k, l] = xj;

    for (const x of [...this.domains[i][j]]) {
      let satisfied = false;
      for (const y of this.domains[k][l]) {
        if (x !== y) {
          satisfied = true;
          break;
        }
      }
      if (!satisfied) {
        this.domains[i][j].delete(x);
        revised = true;
      }
    }

    return revised;
  }

  private ac3(onQueueUpdate?: (length: number) => void): boolean {
    const queue = [...this.arcs];
    
    while (queue.length > 0) {
      onQueueUpdate?.(queue.length);
      const [i, j, k, l] = queue.shift()!;
      
      if (this.revise([i, j], [k, l])) {
        if (this.domains[i][j].size === 0) {
          return false;
        }
        
        // Add affected arcs back to queue
        for (const [ni, nj, nk, nl] of this.arcs) {
          if ((nk === i && nl === j) && !(ni === k && nj === l)) {
            queue.push([ni, nj, i, j]);
          }
        }
      }
    }
    
    return true;
  }

  private isComplete(grid: number[][]): boolean {
    return grid.every(row => row.every(cell => cell !== 0));
  }

  private findEmptyCell(grid: number[][]): [number, number] | null {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  }

  private backtrack(grid: number[][]): boolean {
    if (this.isComplete(grid)) {
      return true;
    }

    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) {
      return false;
    }

    const [row, col] = emptyCell;
    const domain = [...this.domains[row][col]].sort((a, b) => a - b);

    for (const value of domain) {
      if (this.isValid(grid, row, col, value)) {
        grid[row][col] = value;
        
        if (this.backtrack(grid)) {
          return true;
        }
        
        grid[row][col] = 0;
      }
    }

    return false;
  }

  private isValid(grid: number[][], row: number, col: number, value: number): boolean {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (j !== col && grid[row][j] === value) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === value) {
        return false;
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (i !== row && j !== col && grid[i][j] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(grid: number[][], onQueueUpdate?: (length: number) => void): { success: boolean; grid: number[][] } {
    // Initialize domains based on input grid
    this.domains = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() =>
        new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
      )
    );

    // Set initial domains based on input
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== 0) {
          this.domains[i][j] = new Set([grid[i][j]]);
        }
      }
    }

    // Run AC-3
    if (!this.ac3(onQueueUpdate)) {
      return { success: false, grid };
    }

    // Create a working copy of the grid
    const workingGrid = grid.map(row => [...row]);

    // Try to solve with backtracking if needed
    const success = this.backtrack(workingGrid);
    
    return {
      success,
      grid: workingGrid
    };
  }
}