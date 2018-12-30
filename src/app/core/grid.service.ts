import { Injectable } from '@angular/core';
import { Subject, Observable, merge, pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { doWhile } from '../shared/operators/doWhile';
import { BallState } from './shared/Ball';
import { ICell } from './shared/Cell';
import { Path } from './shared/Path';
import { Grid } from './shared/Grid';
import { ITurnData } from './shared/TurnData';
import { IGridAnimation, GridAnimationType } from './shared/GridAnimation';
import { ILoopData } from './shared/LoopData';

export const SCORE_MULTIPLIER = 10;

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private _outputSubject: Subject<ITurnData> = new Subject<ITurnData>();
  private _animationSubject: Subject<IGridAnimation> = new Subject<IGridAnimation>();

  public input$: Subject<ITurnData> = new Subject<ITurnData>();
  public output$: Observable<ITurnData>;
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
    ).subscribe(data => this._outputSubject.next(data));
  }

  private getTurnObservable(
    input$: Observable<ITurnData>,
    animationSubject: Subject<IGridAnimation>
  ): Observable<ITurnData> {
    const loopStart$ = new Subject<ITurnData>();
    const result$ = doWhile(
      loopStart$,
      data => !!Grid.getMatches(data.cells).length,
      pipe(
        // Process matches
        map(data => ({ turn: data, matches: Grid.getMatches(data.cells) })),
        // Start animation
        tap((data: ILoopData) =>
          data.matches.forEach(cells => animationSubject.next({
            type: GridAnimationType.Match,
            cells
          }))
        ),
        // Remove matching ball from the grid
        map((data: ILoopData) => {
          return {
            turn: {
              cells: data.turn.cells.map(cell => {
                const isMatch = data.matches.some(match =>
                  match.some(el => el.id === cell.id));
                return isMatch ? { id: cell.id } : cell;
              }),
              cell: data.turn.cell,
              nextColors: data.turn.nextColors,
              score: data.turn.score
                + data.matches.reduce((result, match) => result + match.length, 0) * SCORE_MULTIPLIER
            },
            matches: data.matches
          };
        }),
        // Process new turn
        map((data: ILoopData) => {
          if (data.matches.length) {
            return data;
          }
          const cells: ICell[] = data.turn.cells;
          const openCells = cells.filter(c => !c.ball);
          let colors = [];
          if (data.turn.nextColors && data.turn.nextColors.length === Grid.ITEMS_PER_TURN) {
            colors = data.turn.nextColors;
          } else {
            colors = this.getRandomColors();
          }

          const updated = [];
          const newAmount = Math.min(openCells.length, Grid.ITEMS_PER_TURN);
          for (let i = 0; i < newAmount; i++) {
            const r = Math.floor(openCells.length * Math.random());
            const cell = cells[openCells[r].id];
            cell.ball = {
              id: openCells[r].id,
              color: colors[i],
              state: BallState.idle
            };
            updated.push(cell);
            openCells.splice(r, 1);
          }

          return {
            turn: {
              cells: data.turn.cells,
              cell: data.turn.cell,
              nextColors: this.getRandomColors(),
              score: data.turn.score,
            },
            updated
          };
        }),
        tap((data: ILoopData) => {
          if (data.updated) {
            animationSubject.next({
              type: GridAnimationType.Add,
              cells: data.updated
            });
          }
        }),
        map((data: ILoopData) => data.turn)
      ));

    input$
      .pipe(filter(data => !data.cell))
      .subscribe(loopStart$);

    return result$.pipe(
      tap(data => {
        if (!data.cells.filter(cell => !cell.ball).length) {
          animationSubject.next({ type: GridAnimationType.Full });
        }
      })
    );
  }

  private getMoveObservable(
    input$: Observable<ITurnData>,
    animationSubject: Subject<IGridAnimation>
  ): Observable<ITurnData> {
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
      tap((data: { data: ITurnData, path: ICell[] }) =>
        animationSubject.next({
          type: data.path ? GridAnimationType.Move : GridAnimationType.Wrong,
          cells: data.path
        })
      ),
      map((data: { data: ITurnData, path: ICell[] }) => data.data)
    );
  }

  private getActivateObservable(input$: Observable<ITurnData>): Observable<ITurnData> {
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
          score: data.score,
          nextColors: data.nextColors,
          cells,
        };
    }));
  }

  private getRandomColors() {
    const colors = [];
    for (let i = 0; i < Grid.ITEMS_PER_TURN; i++) {
      colors.push(Grid.getRandomColor());
    }
    return colors;
  }
}
