import { Injectable } from '@angular/core';
import { BallState, BallColors, BallColor } from './ball/ball.model';
import { ICell } from './cell/cell.model';
import { Subject, Observable, merge, pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Path, IPathCell } from './path.model';

export interface IGridInput {
  cells: ICell[];
  cell?: ICell;
}

export enum GridAnimationType {
  Move = 0,
  Match = 1,
  Wrong = 2,
}

export interface IGridAnimation {
  type: GridAnimationType;
  cells: ICell[];
}

export const DEFAULT_NEW_BALLS_COUNT = 3;

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private _outputSubject: Subject<ICell[]> = new Subject<ICell[]>();
  private _animationSubject: Subject<IGridAnimation> = new Subject<IGridAnimation>();

  public input$: Subject<IGridInput> = new Subject<IGridInput>();
  public output$: Observable<ICell[]>;
  public animation$: Observable<IGridAnimation>;

  public static getRandomColor(): BallColor {
    return BallColors[Math.floor(BallColors.length * Math.random())];
  }

  public static getGrid(size: number = Path.GRID_SIZE): ICell[] {
    const result: ICell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i });
    }
    return result;
  }

  public static getRandomGrid(size: number = Path.GRID_SIZE): ICell[] {
    const result: ICell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i, ball: { id: i, color: GridService.getRandomColor(), state: BallState.idle} });
    }
    return result;
  }

  constructor() {
    this.output$ = this._outputSubject.asObservable();
    this.animation$ = this._animationSubject.asObservable();

    const turn$ = this.getTurnObservable(this.input$);
    const move$ = this.getMoveObservable(this.input$, this._animationSubject);
    const activate$ = this.getActivateObservable(this.input$);

    merge(
      turn$,
      activate$,
      move$
    ).subscribe(data => this._outputSubject.next(data.cells));
  }

  private getCheckObservable(input$: Observable<IGridInput>): Observable<IGridInput> {
    return input$.pipe(
      filter(data => !data.cell),
      map(data => data)
    );
  }

  private getTurnObservable(input$: Observable<IGridInput>): Observable<IGridInput> {
    return input$.pipe(
      filter(data => !data.cell),
      map((data: IGridInput) => {
        const cells: ICell[] = data.cells;
        const openCells = cells
          .filter(c => !c.ball);
        if (openCells.length >= DEFAULT_NEW_BALLS_COUNT) {
          for (let i = 0; i < DEFAULT_NEW_BALLS_COUNT; i++) {
            const r = Math.floor(openCells.length * Math.random());
            cells[openCells[r].id].ball = {
              id: openCells[r].id,
              color: GridService.getRandomColor(),
              state: BallState.idle
            };
            openCells.splice(r, 1);
          }
        }
        return { cells };
      })
    );
  }

  private getMoveObservable(
    input$: Observable<IGridInput>,
    animationSubject: Subject<IGridAnimation>
  ): Observable<IGridInput> {
    return input$.pipe(
      filter(data => data.cell && !data.cell.ball),
      map(data => {
        const activeCell = data.cells
          .filter(c => c.ball && c.ball.state === BallState.active)[0];
        // If we have an active ball
        // check if the ball can be moved to the cell
        if (!activeCell) {
          return { data, path: null };
        }
        const pathGrid = Path.getPathGrid(data.cells);
        const path = Path.getPath(
          pathGrid[activeCell.id],
          pathGrid[data.cell.id],
          pathGrid
        ).map(pathEl => data.cells[pathEl.index]);

        // No path - return the current cell
        if (!path.length) {
          return { data, path: null };
        }
        // Move the ball and return the updated grid
        const ballToMove = Object.assign(activeCell.ball,
          { id: data.cell.id, state: BallState.idle });
        delete data.cells[activeCell.id].ball;
        data.cells[data.cell.id].ball = ballToMove;
        return { data, path };
      }),
      tap((data: { data: IGridInput, path: ICell[] }) =>
        animationSubject.next({
          type: data.path ? GridAnimationType.Move : GridAnimationType.Wrong,
          cells: data.path
        })
      ),
      map((data: { data: IGridInput, path: ICell[] }) => data.data)
    );
  }

  private getActivateObservable(input$: Observable<IGridInput>): Observable<IGridInput> {
    return input$
      .pipe(
        filter(data => !!(data.cell && data.cell.ball)),
        map(data => {
        const cells = data.cells.map(cell => {
          // If the current cell doesn't contain a ball
          // then check if we have an active ball on the grid
          if (!cell.ball) {
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
  }
}
