import { Injectable } from '@angular/core';
import { Ball, BallState, BallColors, BallColor } from './ball/ball.model';
import { Cell } from './cell/cell.model';
import { Subject, Observable } from 'rxjs';
import { filter, map, concat } from 'rxjs/operators';

export interface GridInput {
  cells: Cell[];
  cell?: Cell;
}
export interface GridOutput {
  cells: Cell[];
  gameOver?: boolean;
}

export const DEFAULT_GRID_SIZE = 9;
export const DEFAULT_NEW_BALLS_COUNT = 3;

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private _outputSubject: Subject<Cell[]> = new Subject<Cell[]>();

  public input: Subject<GridInput> = new Subject<GridInput>();
  public output: Observable<Cell[]>;

  constructor() {
    this.output = this._outputSubject.asObservable();
    const getRandomColor = () => BallColors[Math.floor(BallColors.length * Math.random())];

    // If the cell field is empty then there is a new turn
    const turnStream = this.input
      .pipe(filter(data => data.cell === undefined))
      .pipe(map((data: GridInput) => {
        const cells: Cell[] = data.cells.slice(0);
        const openCells = cells
          .filter(c => c.ball === undefined)
          .map(c => c.id);
        if (openCells.length >= DEFAULT_NEW_BALLS_COUNT) {
          for (let i = 0; i < DEFAULT_NEW_BALLS_COUNT; i++) {
            const r = Math.floor(openCells.length * Math.random());
            cells[openCells[r]].ball = {
              id: openCells[r],
              color: getRandomColor(),
              state: BallState.idle
            };
            openCells.splice(r, 1);
          }
        }
        return { cells };
      }))
      .subscribe(data => this._outputSubject.next(data.cells));
    // There is a cell stream otherwise
    this.input
      .pipe(filter(data => data.cell !== undefined))
      .pipe(map(data => ({
        cell: data.cell,
        cells: data.cells
          .map(cell => {
            // If the current cell doesn't contain a ball
            // then just return the current cell
            if (cell.ball === undefined) {
              return cell;
            }
            // If the current cell is the active one
            // then set the proper state
            if (cell.id === data.cell.id) {
              return Object.assign(cell,
                { ball: Object.assign(cell.ball, { state: BallState.active }) });
            }
            // Set all the other cells balls to idle state
            return Object.assign(cell,
              { ball: Object.assign(cell.ball, { state: BallState.idle }) });
          })
        })
      ))
      // .pipe(concat(turnStream))
      .subscribe(data => this._outputSubject.next(data.cells));
  }

  public getGrid(size: number = DEFAULT_GRID_SIZE): Cell[] {
    const result: Cell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i });
    }
    return result;
  }
}
