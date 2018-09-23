import { Injectable } from '@angular/core';
import { Ball, BallState, BallColors, BallColor } from './ball/ball.model';
import { Cell } from './cell/cell.model';
import { Subject, Observable, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface GridInput {
  cells: Cell[];
  cell?: Cell;
}

export enum GridState {
}

export interface GridOutput {
  cells: Cell[];
  state: GridState;
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
    const getPath = (from: number, to: number, grid: Cell[]) => [ true ];

    // If the cell field is empty then there is a new turn
    const turn$ = this.input
      .pipe(filter(data => data.cell === undefined))
      .pipe(map((data: GridInput) => {
        const cells: Cell[] = data.cells;
        const openCells = cells
          .filter(c => c.ball === undefined);
        if (openCells.length >= DEFAULT_NEW_BALLS_COUNT) {
          for (let i = 0; i < DEFAULT_NEW_BALLS_COUNT; i++) {
            const r = Math.floor(openCells.length * Math.random());
            cells[openCells[r].id].ball = {
              id: openCells[r].id,
              color: getRandomColor(),
              state: BallState.idle
            };
            openCells.splice(r, 1);
          }
        }
        return { cells };
      }));

    // There is a cell stream otherwise
    const move$ = this.input
      .pipe(filter(data => data.cell !== undefined && data.cell.ball === undefined))
      .pipe(map(data => {
        const activeCell = data.cells
          .filter(c => c.ball !== undefined)
          .filter(c => c.ball.state === BallState.active)
          .pop();
        // If we have an active ball
        // check if the ball can be moved to the cell
        if (!activeCell) {
          return data;
        }
        const path = getPath(activeCell.id, data.cell.id, data.cells);
        // No path - return the current cell
        if (!path.length) {
          return data;
        }
        // Move the ball and return the updated grid
        const ballToMove = Object.assign(activeCell.ball,
          { id: data.cell.id, state: BallState.idle });
        delete data.cells[activeCell.id].ball;
        Object.assign(data.cells[data.cell.id], { ball: ballToMove });
        return data;
      }));

    const activate$ = this.input
      .pipe(filter(data => data.cell !== undefined && data.cell.ball !== undefined))
      .pipe(map(data => {
        const cells = data.cells.map(cell => {
          // If the current cell doesn't contain a ball
          // then check if we have an active ball on the grid
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
        });
        return {
          cell: data.cell,
          cells
        };
    }));

    merge(
      turn$,
      activate$,
      move$
    ).subscribe(data => this._outputSubject.next(data.cells));
  }

  public getGrid(size: number = DEFAULT_GRID_SIZE): Cell[] {
    const result: Cell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i });
    }
    return result;
  }
}
