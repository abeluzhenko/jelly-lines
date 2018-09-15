import { Cell, CellState } from '../cell/cell.model';
import { Ball, BallColors, BallColor, BallState } from '../ball/ball.model';

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
        result[i].push(new Cell(i * (size - 1) + j));
      }
    }
    return result;
  }

  private generateRandomCells(size: number): Cell[][] {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push([]);
      for (let j = 0; j < size; j++) {
        result[i].push(new Cell(
          i * (size - 1) + j,
          new Ball(
            i * (size - 1) + j,
            BallColors[Math.floor(BallColors.length * Math.random())] as BallColor
          )
        ));
      }
    }
    return result;
  }

  public get snapshot(): Cell[][] {
    const result = [];
    for (let i = 0; i < this._cells.length; i++) {
      result.push([]);
      for (let j = 0; j < this._cells[i].length; j++) {
        let ball = null;
        if (this._cells[i][j].ball) {
          ball = new Ball(
            this._cells[i][j].ball.id,
            this._cells[i][j].ball.color,
            this._cells[i][j].ball.state
          );
        }
        result[i].push(
          new Cell(
            this._cells[i][j].id,
            ball,
            this._cells[i][j].state
          )
        );
      }
    }
    return result;
  }

  public randomize() {
    this._cells = this.generateRandomCells(this._size);
  }
}
