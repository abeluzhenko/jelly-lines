import { Injectable } from '@angular/core';
import { Ball, BallState, BallColors, BallColor } from './ball/ball.model';
import { Cell } from './cell/cell.model';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface GridInput {
  cells: Cell[];
  cell?: Cell;
}

export const DEFAULT_GRID_SIZE = 9;

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private _outputSubject: Subject<Cell[]> = new Subject<Cell[]>();

  public input: Subject<GridInput> = new Subject<GridInput>();
  public output: Observable<Cell[]>;

  constructor() {
    this.output = this._outputSubject.asObservable();

    this.input
      .pipe(map(data => ({
        cell: data.cell,
        cells: data.cells
          .map(cell => {
            // If there is no active cell in the stream
            // or the current cell doesn't contain a ball
            // then just return the current cell
            if (data.cell === undefined || cell.ball === undefined) {
              return cell;
            }
            // If the current cell is the active one
            // then set the proper state
            if (cell.id === data.cell.id) {
              return Object.assign(cell, { ball: { state: BallState.active } });
            }
            // Set all the other cells balls to idle state
            return Object.assign(cell, { ball: { state: BallState.idle } });
          })
        })
      ))
      .subscribe(data => this._outputSubject.next(data.cells));
  }

  public getGrid(size: number = DEFAULT_GRID_SIZE): Cell[] {
    const result: Cell[] = [];
    for (let i = 0; i < size * 2; i++) {
      result.push({
        id: i,
        ball: {
          id: i,
          color: BallColor.red,
          state: BallState.idle
        }
      });
    }
    return result;
  }
}
