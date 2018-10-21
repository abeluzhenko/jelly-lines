import { Injectable } from '@angular/core';
import { BallState } from './ball/ball.model';
import { ICell } from './cell/cell.model';
import { Subject, Observable, merge } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Path } from './path.model';
import { IGridInput, IGridAnimation, Grid, GridAnimationType } from './grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private _outputSubject: Subject<ICell[]> = new Subject<ICell[]>();
  private _animationSubject: Subject<IGridAnimation> = new Subject<IGridAnimation>();

  public input$: Subject<IGridInput> = new Subject<IGridInput>();
  public output$: Observable<ICell[]>;
  public animation$: Observable<IGridAnimation>;

  constructor() {
    this.output$ = this._outputSubject.asObservable();
    this.animation$ = this._animationSubject.asObservable();

    const turn$ = this.getTurnObservable(this.input$, this._animationSubject);
    const move$ = this.getMoveObservable(this.input$, this._animationSubject);
    const activate$ = this.getActivateObservable(this.input$);

    merge(
      turn$,
      activate$,
      move$
    ).subscribe(data => this._outputSubject.next(data.cells));
  }

  private getTurnObservable(
    input$: Observable<IGridInput>,
    animationSubject: Subject<IGridAnimation>
  ): Observable<IGridInput> {
    return input$.pipe(
      filter(data => !data.cell),
      // Process matches
      map((data: IGridInput) => ({ data, matches: Grid.getMatches(data.cells) })),
      tap((data: { data: IGridInput, matches: ICell[][]}) =>
        data.matches.forEach(cells => animationSubject.next({
          type: GridAnimationType.Match,
          cells
        }))
      ),
      map((data: { data: IGridInput, matches: ICell[][]}) => ({
        cells: data.data.cells.map(cell => {
          const isMatch = data.matches.some(match => match.some(el => el.id === cell.id));
          return isMatch ? { id: cell.id } : cell;
        }),
        cell: data.data.cell
      })),
      // New turn
      map((data: IGridInput) => {
        const cells: ICell[] = data.cells;
        const openCells = cells
          .filter(c => !c.ball);
        if (openCells.length >= Grid.ITEMS_PER_TURN) {
          for (let i = 0; i < Grid.ITEMS_PER_TURN; i++) {
            const r = Math.floor(openCells.length * Math.random());
            cells[openCells[r].id].ball = {
              id: openCells[r].id,
              color: Grid.getRandomColor(),
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
