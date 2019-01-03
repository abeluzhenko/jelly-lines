import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { scan, share } from 'rxjs/operators';

import { BallState } from './shared/Ball';
import { ICell } from './shared/Cell';
import { Path } from './shared/Path';
import { Grid } from './shared/Grid';
import { IGridAnimation, GridAnimationType } from './shared/GridAnimation';
import { Action, SelectCellAction } from './shared/Action';
import { IGameState } from './shared/GameState';
import { GridFactoryService } from './grid-factory.service';

export const SCORE_MULTIPLIER = 10;

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private _action$: Subject<Action> = new Subject<Action>();
  private _state$: Subject<IGameState> = new Subject<IGameState>();

  public get state$(): Observable<IGameState> {
    return this._state$.asObservable();
  }

  public get initialState(): IGameState {
    return this._gridFactory.getInitialState();
  }

  constructor(private _gridFactory: GridFactoryService) {
    this._action$
      .pipe(
        scan((state: IGameState, action: Action) =>
          this.getUpdatedState(state, action), this.initialState),
        share(),
      )
      .subscribe((state: IGameState) => this._state$.next(state));
  }

  public dispatch(action: Action) {
    this._action$.next(action);
  }

  protected getUpdatedState(state: IGameState, action: Action): IGameState {
    let newState = state;
    if (action instanceof SelectCellAction && action.payload) {
      newState.turn.cell = action.payload;
      newState = action.payload.ball ? this.activate(state) : this.move(state);
    } else {
      newState = this.turn(state);
    }
    return newState;
  }

  private turn(state: IGameState): IGameState {
    let matches = Grid.getMatches(state.turn.cells);
    const animation = [];
    const turn = state.turn;
    const ui = state.ui;

    while (matches.length) {
      // Add animations
      animation.push(
        ...matches.map((matchCells) => ({
          type: GridAnimationType.Match,
          cells: matchCells
        }))
      );

      // Remove matching ball from the grid
      turn.cells = state.turn.cells.map((cell) => {
        const isMatch = matches.some((match) => match.some(el => el.id === cell.id));
        return isMatch ? { id: cell.id } : cell;
      });

      ui.score +=
        matches.reduce((result, match) => result + match.length, 0) * SCORE_MULTIPLIER;

      matches = Grid.getMatches(state.turn.cells);
    }

    if (!animation.length) {
      // Process new turn
      const cells: ICell[] = state.turn.cells;
      const openCells = cells.filter((cell) => !cell.ball);
      let colors = [];
      if (
        state.turn.nextColors &&
        state.turn.nextColors.length === Grid.ITEMS_PER_TURN
      ) {
        colors = state.turn.nextColors;
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

      turn.nextColors = this.getRandomColors();

      if (updated) {
        animation.push({
          type: GridAnimationType.Add,
          cells: updated
        });
      }
    }
    return {
      turn,
      animation,
      ui,
    };
  }

  private move(state: IGameState): IGameState {
    const activeCell = state.turn.cells
      .filter((cell) => cell.ball && cell.ball.state === BallState.active)[0];

    // If we have an active ball
    // check if the ball can be moved to the cell
    if (!activeCell) {
      return state;
    }

    const pathGrid = Path.getPathGrid(state.turn.cells);
    const path = Path
      .getPath(
        pathGrid[activeCell.id],
        pathGrid[state.turn.cell.id],
        pathGrid
      )
      .map((pathEl) => state.turn.cells[pathEl.index]);

    if (path.length) {
      // Move the ball and return the updated grid
      const ballToMove = {
        ...activeCell.ball,
        id: state.turn.cell.id,
        state: BallState.idle,
      };
      delete state.turn.cells[activeCell.id].ball;

      state.turn.cells[state.turn.cell.id].ball = ballToMove;
    }
    return {
      ...state,
      animation: [
        path.length ?
        { type: GridAnimationType.Move, cells: path } :
        { type: GridAnimationType.Wrong }
      ],
    };
  }

  private activate(state: IGameState): IGameState {
    const cells = state.turn.cells.map((cell) => {
      // If the current cell doesn't contain a ball
      // then check if we have an active ball on the grid
      if (!cell.ball) {
        return cell;
      }
      // If the current cell is the active one
      // then set the proper state
      if (cell.id === state.turn.cell.id) {
        return Object.assign(cell,
          { ball: Object.assign(cell.ball, { state: BallState.active }) });
      }
      // Set all the other cells balls to idle state
      return Object.assign(cell,
        { ball: Object.assign(cell.ball, { state: BallState.idle }) });
    });
    return {
      ...state,
      turn: { cells }
    } as IGameState;
  }

  private getRandomColors() {
    const colors = [];
    for (let i = 0; i < Grid.ITEMS_PER_TURN; i++) {
      colors.push(Grid.getRandomColor());
    }
    return colors;
  }
}
