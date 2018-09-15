import { Cell } from '../cell/cell.model';
import { Ball, BallColors, BallColor } from '../ball/ball.model';

export class Grid {
  private _cells: Cell[][];
  private _size: number;
  constructor(size: number = 9) {
    this._size = size;
    this._cells = this.generateCells(size);
  }

  private generateCells(size: number): Cell[][] {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push([]);
      for (let j = 0; j < size; j++) {
        result[i].push(new Cell(new Ball(
          BallColors[Math.floor(BallColors.length * Math.random())] as BallColor
        )));
      }
    }
    return result;
  }

  public getCell(col: number, row: number): Cell {
    if (Math.max(col, row, -1) === -1 || Math.min(col, row, this._size) === this._size) {
      throw new Error('Column or row index is within array\'s bounds');
    }
    return this._cells[col][row];
  }

  public get cells(): Cell[][] {
    return this._cells;
  }
}
