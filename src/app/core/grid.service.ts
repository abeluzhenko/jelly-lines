import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { scan, share } from 'rxjs/operators';

import {
  Cell,
  Path,
  BallState,
  BallColor,
  Actions,
  SelectCellAction,
  TurnData,
  GameState,
  GridAnimationType
} from './shared';
import { GridFactoryService } from './grid-factory.service';
import * as Grid from './shared/Grid';


export const SCORE_MULTIPLIER = 10;

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private action$: Subject<Actions>;
  private _state$: BehaviorSubject<GameState>;

  public get state$(): Observable<GameState> {
    return this._state$.asObservable();
  }

  public get initialState(): GameState {
    return this.gridFactory.initialState;
  }

  constructor(private gridFactory: GridFactoryService) {
    this.action$ = new Subject<Actions>();
    this._state$ = new BehaviorSubject<GameState>(this.initialState);
    this.action$
      .pipe(
        scan((state: GameState, action: Actions) =>
          this.getUpdatedState(state, action),
          this.initialState
        ),
        share(),
      )
      .subscribe((state: GameState) => this._state$.next(state));
  }

  public dispatch(action: Actions) {
    this.action$.next(action);
  }

  protected getUpdatedState(state: GameState, action: Actions): GameState {
    const newState = state;

    if (action instanceof SelectCellAction && action.payload) {
      newState.turn.cell = action.payload;

      return action.payload.ball
        ? this.activate(state)
        : this.move(state);
    }

    if (
      !state.animation.length ||
      state.animation[state.animation.length - 1].type === GridAnimationType.Move
    ) {
      return this.turn(state);
    }

    return newState;
  }

  private turn(state: GameState): GameState {
    let matches = Grid.getMatches(state.turn.cells);
    const animation = [];
    const turn = state.turn;
    const ui = { ...state.ui, turn: state.ui.turn + 1 };

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
      const cells: Cell[] = state.turn.cells;
      const openCells = cells.filter((cell) => !cell.ball);
      let colors = [];
      if (
        state.ui.nextColors &&
        state.ui.nextColors.length === Grid.ITEMS_PER_TURN
      ) {
        colors = state.ui.nextColors;
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

      ui.nextColors = this.getRandomColors();

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

  private move(state: GameState): GameState {
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
        path.length
          ? { type: GridAnimationType.Move, cells: path }
          : { type: GridAnimationType.Wrong }
      ],
    };
  }

  private activate(state: GameState): GameState {
    const cells = state.turn.cells.map((cell) => {
      if (!cell.ball) {
        return cell;
      }

      return {
        ...cell,
        ball: {
          ...cell.ball,
          state: cell.id === state.turn.cell.id
            ? BallState.active
            : BallState.idle
        }
      };
    });

    return {
      ...state,
      animation: [{ type: GridAnimationType.None }],
      turn: { cells } as TurnData
    };
  }

  private getRandomColors(): BallColor[] {
    return Array.from({ length: Grid.ITEMS_PER_TURN }, () => Grid.getRandomColor());
  }
}
