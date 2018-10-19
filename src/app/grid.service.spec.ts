import { TestBed, inject } from '@angular/core/testing';

import { GridService, DEFAULT_NEW_BALLS_COUNT, GridAnimationType } from './grid.service';
import { BallState, BallColor, BallColors } from './ball/ball.model';
import { ICell } from './cell/cell.model';
import { Path } from './path.model';

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
    const cells = GridService.getGrid(10);

    service.output$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.length).toBe(cells.length);

      // There should be n new balls on the grid
      const fullCells = data.filter(c => c.ball !== undefined);
      expect(fullCells.length).toBe(3);

      done();
    });
    service.input$.next({ cells });
  })());

  it('should properly set the current ball', done => inject([GridService], (service: GridService) => {
    const cells = GridService.getGrid(10);
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
      expect(data[0]).toBeDefined();
      expect(data[0].id).toBe(cell1.id);
      expect(data[10]).toBeDefined();
      expect(data[10].id).toBe(cell2.id);
      switch (step) {
        case 0:
          expect(data[0].ball.state).toBe(BallState.idle);
          expect(data[10].ball.state).toBe(BallState.idle);
        break;
        case 1:
          expect(data[0].ball).toBeDefined();
          expect(data[10].ball).toBeDefined();
          expect(data[0].ball.state).toBe(BallState.active);
          expect(data[10].ball.state).toBe(BallState.idle);
        break;
        case 2:
          expect(data[0].ball).toBeDefined();
          expect(data[10].ball).toBeDefined();
          expect(data[0].ball.state).toBe(BallState.idle);
          expect(data[10].ball.state).toBe(BallState.active);
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
    const cells = GridService.getGrid(9);

    let count = 0;
    service.output$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.length).toBe(cells.length);

      // There should be n new balls on the grid
      const fullCells = data.filter(c => c.ball !== undefined);
      count += DEFAULT_NEW_BALLS_COUNT;
      expect(fullCells.length).toBe(count);
      if (fullCells.length === 81) {
        done();
      }
    });

    for (let i = 0; i < 81 / 3; i++) {
      service.input$.next({ cells });
    }
  })());

  it('should properly move the current ball (if there is a path to the target)', done => inject([GridService], (service: GridService) => {
    const cells = GridService.getGrid(Path.GRID_SIZE);
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
        cell1 = data
          .filter(c => c.ball !== undefined)
          .pop();
        expect(cell1).toBeTruthy();
        expect(cell1.ball).toBeDefined();
        expect(cell1.ball.state).toBe(BallState.idle);
        step++;
        return service.input$.next({ cells, cell: cell1 });
      }
      if (step === 1) {
        expect(data[cell1.id].ball).toBeDefined();
        expect(data[cell1.id].ball.state).toBe(BallState.active);
        cell2 = data
          .filter(c => c.ball === undefined)
          .pop();
        expect(cell2).toBeTruthy();
        step++;
        return service.input$.next({ cells, cell: cell2 });
      }
      if (step === 2) {
        expect(data[cell1.id].ball).toBeUndefined();
        expect(data[cell2.id].ball).toBeDefined();
        expect(data[cell2.id].ball.state).toBe(BallState.idle);
        dataSubscription.unsubscribe();
        return done();
      }
    });
    service.input$.next({ cells });
  })());

  it('should not move the current ball if there is no path to the target', done => inject([GridService], (service: GridService) => {
    const cells = GridService.getGrid(Path.GRID_SIZE);
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
        expect(data[0].ball).toBeDefined();
        expect(data[0].ball.state).toBe(BallState.active);
        targetCell = data
          .filter(c => c.ball === undefined)
          .pop();
        expect(targetCell).toBeTruthy();
        step++;
        return service.input$.next({ cells, cell: targetCell });
      }
      if (step === 1) {
        expect(data[0].ball).toBeDefined();
        expect(data[0].ball.state).toBe(BallState.active);
        expect(data[targetCell.id].ball).toBeUndefined();
        dataSubscription.unsubscribe();
        return done();
      }
    });
    service.input$.next({ cells, cell: cells[0] });
  })());
});
