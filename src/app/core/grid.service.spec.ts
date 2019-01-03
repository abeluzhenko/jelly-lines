import { inject, TestBed } from '@angular/core/testing';

import { GridService, SCORE_MULTIPLIER } from './grid.service';
import { BallState, BallColor } from './shared/Ball';
import { Grid } from './shared/Grid';
import { GridAnimationType } from './shared/GridAnimation';
import { SelectCellAction, Action, StartGameAction } from './shared/Action';
import { GameState, IGameState } from './shared/GameState';
import { ICell } from './shared/Cell';

class GridServiceMocked extends GridService {
  public getUpdatedStateTest(state: IGameState, action: Action): IGameState {
    return super.getUpdatedState(state, action);
  }
}

fdescribe('GridService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: GridService, useClass: GridServiceMocked } ]
    });
  });

  it('should be created', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));

  it('should properly generate a grid', (done) => inject([GridService], (service: GridService) => {
    const sub = service.state$.subscribe((state) => {
      expect(state).toBeDefined();
      expect(state.turn).toBeDefined();
      expect(state.turn.cells.length).toBe(state.turn.cells.length);

      // There should be n new balls on the grid
      const fullCells = state.turn.cells.filter(c => c.ball !== undefined);
      expect(fullCells.length).toBe(Grid.ITEMS_PER_TURN);

      sub.unsubscribe();
      done();
    });
    service.dispatch(new StartGameAction());
  })());

  it('should properly set the current ball', () =>
    inject([GridService], (service: GridServiceMocked) => {
    const cells = Grid.getGrid(10);
    const cell1 = {
      id: 0,
      ball: { id: 0, color: BallColor.red, state: BallState.idle },
    };
    const cell2 = {
      id: 10,
      ball: { id: 10, color: BallColor.green, state: BallState.idle },
    };
    cells[0] = cell1;
    cells[10] = cell2;

    let newState = new GameState();
    newState.turn.cells = cells;

    // Select the first ball
    newState = service.getUpdatedStateTest(newState, new SelectCellAction(cells[0]));
    expect(newState.turn.cells[0].ball).toBeDefined();
    expect(newState.turn.cells[10].ball).toBeDefined();
    expect(newState.turn.cells[0].ball.state).toBe(BallState.active);
    expect(newState.turn.cells[10].ball.state).toBe(BallState.idle);

    // Select the second ball
    newState = service.getUpdatedStateTest(newState, new SelectCellAction(cells[10]));
    expect(newState.turn.cells[0].ball).toBeDefined();
    expect(newState.turn.cells[10].ball).toBeDefined();
    expect(newState.turn.cells[0].ball.state).toBe(BallState.idle);
    expect(newState.turn.cells[10].ball.state).toBe(BallState.active);
  })());

  it('should properly add new items to the grid on a new step',
    (done) => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);

    let count = 0;
    const dataSubscription = service.state$.subscribe((state) => {
      expect(state.turn).toBeDefined();
      expect(state.turn.cells.length).toBe(cells.length);

      // There should be n new balls on the grid
      const fullCells = state.turn.cells.filter(c => c.ball);
      count += Grid.ITEMS_PER_TURN;
      expect(fullCells.length).toBe(count);

      expect(state.animation).toBeDefined();
      expect(state.animation.length).toBe(1);

      for (let i = 0; i < state.animation.length; i++) {
        expect(state.animation[i].type).toBe(GridAnimationType.Add);
        expect(state.animation[i].cells.length).toEqual(Grid.ITEMS_PER_TURN);
      }
      dataSubscription.unsubscribe();
      done();
    });

    // service.input$.next({ cells, nextColors: [], score: 0 });
    service.dispatch(new StartGameAction());
  })());

  it('should setup new balls colors on a new turn', (done) => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);
    let dataSubscription = service.state$.subscribe((state) => {
      expect(state).toBeDefined();
      expect(state.turn.cells.length).toBe(cells.length);
      expect(state.turn.nextColors).toBeTruthy();
      expect(state.turn.nextColors.length).toBe(3);
      const existBalls = state.turn.cells.filter(cell => cell.ball);
      const nextColors = state.turn.nextColors.sort();
      dataSubscription.unsubscribe();

      dataSubscription = service.state$.subscribe(data2 => {
        expect(data2).toBeDefined();
        const newColors = state.turn.cells
          .filter(cell => cell.ball && !existBalls.some(el => el.id === cell.id))
          .map(cell => cell.ball.color)
          .sort();
        expect(newColors).toBeTruthy();
        expect(newColors.length).toEqual(3);
        expect(newColors).toEqual(nextColors);
        dataSubscription.unsubscribe();
        done();
      });
      service.dispatch(new StartGameAction());
    });
    service.dispatch(new StartGameAction());
  })());

  it('should properly move the current ball (if there is a path to the target)',
    (done) => inject([GridService], (service: GridService) => {
    let step = 0;
    let cell1: ICell;
    let cell2: ICell;
    const dataSubscription = service.state$.subscribe((state) => {
      if (step === 0) {
        cell1 = state.turn.cells.filter(c => c.ball)[0];
        expect(cell1).toBeTruthy();
        expect(cell1.ball).toBeDefined();
        expect(cell1.ball.state).toBe(BallState.idle);
        step++;
        service.dispatch(new SelectCellAction(cell1));
        return;
      }
      if (step === 1) {
        expect(state.turn.cells[cell1.id].ball).toBeDefined();
        expect(state.turn.cells[cell1.id].ball.state).toBe(BallState.active);
        cell2 = state.turn.cells.filter(c => !c.ball)[0];
        expect(cell2).toBeTruthy();
        step++;
        service.dispatch(new SelectCellAction(cell2));
        return;
      }
      if (step === 2) {
        expect(state.turn.cells[cell1.id].ball).toBeUndefined();
        expect(state.turn.cells[cell2.id].ball).toBeDefined();
        expect(state.turn.cells[cell2.id].ball.state).toBe(BallState.idle);
        expect(state.animation).toBeDefined();
        expect(state.animation.length).toBe(1);
        expect(state.animation[0].type).toBe(GridAnimationType.Move);
        expect(state.animation[0].cells.length).toBeTruthy();
        dataSubscription.unsubscribe();
        return done();
      }
    });
    service.dispatch(new StartGameAction());
  })());

  it('should not move the current ball if there is no path to the target',
    () => inject([GridService], (service: GridServiceMocked) => {
    const cells = Grid.getGrid();
    cells[0] = { id: 0, ball: { id: 0, color: BallColor.green, state: BallState.idle }};
    cells[1] = { id: 1, ball: { id: 1, color: BallColor.red, state: BallState.idle }};
    cells[9] = { id: 9, ball: { id: 9, color: BallColor.red, state: BallState.idle }};

    let state = new GameState();
    state.turn.cells = cells;

    state = service.getUpdatedStateTest(state, new SelectCellAction(cells[0]));
    // console.log(state);
    expect(state.turn.cells[0].ball).toBeDefined();
    expect(state.turn.cells[0].ball.state).toBe(BallState.active);
    const targetCell = state.turn.cells.filter((cell) => !cell.ball)[0];
    // console.log(targetCell);
    expect(targetCell).toBeTruthy();

    state = service.getUpdatedStateTest(state, new SelectCellAction(targetCell));
    expect(state.turn.cells[0].ball).toBeDefined();
    expect(state.turn.cells[0].ball.state).toBe(BallState.active);
    expect(state.turn.cells[targetCell.id].ball).toBeUndefined();
    expect(state.animation).toBeDefined();
    expect(state.animation.length).toBe(1);
    expect(state.animation[0].type).toBe(GridAnimationType.Wrong);
    expect(state.animation[0].cells).not.toBeDefined();
  })());

  it('should properly process matches',
    () => inject([GridService], (service: GridServiceMocked) => {
    const cells = Grid.getGrid();
    for (let i = 0; i < 6; i++) {
      cells[i * 10].ball = { id: i * 10, state: BallState.idle, color: BallColor.blue };
    }
    expect(Grid.getMatches(cells).length).toBe(1);

    let state = new GameState();
    state.turn.cells = cells;
    state = service.getUpdatedStateTest(state, new StartGameAction());
    expect(state.animation.length).toEqual(1);
    expect(state.animation[0].type).toEqual(GridAnimationType.Match);
    expect(state.ui.score).toEqual(SCORE_MULTIPLIER * 6);
    expect(Grid.getMatches(state.turn.cells).length).toBe(0);

    // No new items should be added after the match
    expect(state.turn.cells.some(cell => !!cell.ball)).toBeFalsy();
  })());

  it('should properly finish the game when the grid is full',
    () => inject([GridService], (service: GridServiceMocked) => {
    //
  })());

  it('should properly process matches on new turn',
    () => inject([GridService], (service: GridServiceMocked) => {
    const cells = Grid.getGrid(9);
    for (let i = 0; i < 81 - 3; i++) {
      cells[i].ball = { id: i, state: BallState.idle, color: BallColor.blue };
    }
    let state = new GameState();
    state.turn.cells = cells;

    state = service.getUpdatedStateTest(state, new StartGameAction());
    const fullCells1 = state.turn.cells.filter((cell) => cell.ball);
    expect(fullCells1.length).toBe(0);
    expect(state.animation.length).toBeGreaterThan(0);
    for (let i = 0; i < state.animation.length; i++) {
      expect(state.animation[i].type).toBe(GridAnimationType.Match);
    }

    state = service.getUpdatedStateTest(state, new StartGameAction());
    const fullCells2 = state.turn.cells.filter((cell) => cell.ball);
    expect(fullCells2.length).toBe(3);
    expect(state.animation.length).toBe(1);
    for (let i = 0; i < state.animation.length; i++) {
      expect(state.animation[i].type).toBe(GridAnimationType.Add);
    }
  })());
});
