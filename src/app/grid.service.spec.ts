import { TestBed, inject } from '@angular/core/testing';

import { GridService } from './grid.service';
import { BallState, BallColor } from './ball/ball.model';
import { ICell } from './cell/cell.model';
import { Path } from './path.model';
import { Grid, GridAnimationType } from './grid.model';

describe('GridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService]
    });
  });

  it('should be created', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));

  it('should properly generate a grid', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(10);

    service.output$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.cells.length).toBe(cells.length);

      // There should be n new balls on the grid
      const fullCells = data.cells.filter(c => c.ball !== undefined);
      expect(fullCells.length).toBe(3);

      done();
    });
    service.input$.next({ cells });
  })());

  it('should properly set the current ball', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(10);
    const cell1 = {
      id: 0,
      ball: {
        id: 0,
        color: BallColor.red,
        state: BallState.idle
      }
    };
    const cell2 = {
      id: 10,
      ball: {
        id: 10,
        color: BallColor.green,
        state: BallState.idle
      }
    };
    cells[0] = cell1;
    cells[10] = cell2;
    let step = 0;
    service.output$.subscribe(data => {
      expect(data.cells[0]).toBeDefined();
      expect(data.cells[0].id).toBe(cell1.id);
      expect(data.cells[10]).toBeDefined();
      expect(data.cells[10].id).toBe(cell2.id);
      switch (step) {
        case 0:
          expect(data.cells[0].ball.state).toBe(BallState.idle);
          expect(data.cells[10].ball.state).toBe(BallState.idle);
        break;
        case 1:
          expect(data.cells[0].ball).toBeDefined();
          expect(data.cells[10].ball).toBeDefined();
          expect(data.cells[0].ball.state).toBe(BallState.active);
          expect(data.cells[10].ball.state).toBe(BallState.idle);
        break;
        case 2:
          expect(data.cells[0].ball).toBeDefined();
          expect(data.cells[10].ball).toBeDefined();
          expect(data.cells[0].ball.state).toBe(BallState.idle);
          expect(data.cells[10].ball.state).toBe(BallState.active);
          done();
        break;
      }
      step++;
    });
    service.input$.next({ cells });
    service.input$.next({ cells, cell: cell1 });
    service.input$.next({ cells, cell: cell2 });
  })());

  it('should properly add new items to the grid on a new step', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);

    let count = 0;
    service.output$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.cells.length).toBe(cells.length);

      // There should be n new balls on the grid
      const fullCells = data.cells.filter(c => c.ball);
      count += Grid.ITEMS_PER_TURN;
      expect(fullCells.length).toBe(count);
      done();
    });

    service.input$.next({ cells });
  })());

  it('should properly move the current ball (if there is a path to the target)', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(Path.GRID_SIZE);
    let step = 0;
    let cell1: ICell;
    let cell2: ICell;
    const animationSubscription = service.animation$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.type).toBe(GridAnimationType.Move);
      expect(data.cells.length).toBeTruthy();
      animationSubscription.unsubscribe();
    });
    const dataSubscription = service.output$.subscribe(data => {
      if (step === 0) {
        cell1 = data.cells.filter(c => c.ball)[0];
        expect(cell1).toBeTruthy();
        expect(cell1.ball).toBeDefined();
        expect(cell1.ball.state).toBe(BallState.idle);
        step++;
        return service.input$.next({ cells, cell: cell1 });
      }
      if (step === 1) {
        expect(data.cells[cell1.id].ball).toBeDefined();
        expect(data.cells[cell1.id].ball.state).toBe(BallState.active);
        cell2 = data.cells.filter(c => !c.ball)[0];
        expect(cell2).toBeTruthy();
        step++;
        return service.input$.next({ cells, cell: cell2 });
      }
      if (step === 2) {
        expect(data.cells[cell1.id].ball).toBeUndefined();
        expect(data.cells[cell2.id].ball).toBeDefined();
        expect(data.cells[cell2.id].ball.state).toBe(BallState.idle);
        dataSubscription.unsubscribe();
        return done();
      }
    });
    service.input$.next({ cells });
  })());

  it('should not move the current ball if there is no path to the target', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(Path.GRID_SIZE);
    cells[0] = { id: 0, ball: { id: 0, color: BallColor.green, state: BallState.idle }};
    cells[1] = { id: 0, ball: { id: 0, color: BallColor.red, state: BallState.idle }};
    cells[9] = { id: 0, ball: { id: 0, color: BallColor.red, state: BallState.idle }};
    let step = 0;
    let targetCell: ICell;
    const animationSubscription = service.animation$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.type).toBe(GridAnimationType.Wrong);
      expect(data.cells).toBeNull();
      animationSubscription.unsubscribe();
    });
    const dataSubscription = service.output$.subscribe(data => {
      if (step === 0) {
        expect(data.cells[0].ball).toBeDefined();
        expect(data.cells[0].ball.state).toBe(BallState.active);
        targetCell = data.cells.filter(c => !c.ball)[0];
        expect(targetCell).toBeTruthy();
        step++;
        return service.input$.next({ cells, cell: targetCell });
      }
      if (step === 1) {
        expect(data.cells[0].ball).toBeDefined();
        expect(data.cells[0].ball.state).toBe(BallState.active);
        expect(data.cells[targetCell.id].ball).toBeUndefined();
        dataSubscription.unsubscribe();
        return done();
      }
    });
    service.input$.next({ cells, cell: cells[0] });
  })());

  it('should properly process matches', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(Path.GRID_SIZE);
    for (let i = 0; i < 6; i++) {
      cells[i * 10].ball = { id: i * 10, state: BallState.idle, color: BallColor.blue };
    }
    let matches = Grid.getMatches(cells);
    expect(matches.length).toBe(1);
    const animationSubscription = service.animation$.subscribe(data => {
      expect(data).toBeDefined();
      animationSubscription.unsubscribe();
    });
    const dataSubscription = service.output$.subscribe(data => {
      expect(data).toBeDefined();
      matches = Grid.getMatches(data.cells);
      expect(matches.length).toBe(0);

      // No new items should be added after the match
      expect(data.cells.some(cell => !!cell.ball)).toBeFalsy();

      dataSubscription.unsubscribe();
      return done();
    });
    service.input$.next({ cells });
  })());

  xit('should properly finish the game when the grid is full', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);
    const dataSubscription = service.output$.subscribe(data => {
      service.input$.next({ cells });
      if (data.cells.filter(cell => cell.ball).length === 81) {
        dataSubscription.unsubscribe();
        done();
      }
    });
    service.input$.next({ cells });
  })());

  xit('should properly process matches on new turn', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);
    for (let i = 0; i < 6; i++) {
      cells[i * 10].ball = { id: i * 10, state: BallState.idle, color: BallColor.blue };
    }
    const dataSubscription = service.output$.subscribe(data => {
      //
    });
  })());
});
