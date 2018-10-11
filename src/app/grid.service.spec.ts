import { TestBed, inject } from '@angular/core/testing';

import { GridService, DEFAULT_NEW_BALLS_COUNT } from './grid.service';
import { BallState, BallColor } from './ball/ball.model';
import { GridServiceMocked } from './grid-mocked.service';
import { Cell } from './cell/cell.model';

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
    const cells = service.getGrid(10);

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
    const cells = service.getGrid(10);
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
    const cells = service.getGrid(9);

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

  it('should properly move the current ball', done => inject([GridService], (service: GridService) => {
    const cells = service.getGrid(10);
    let step = 0;
    let cell1: Cell;
    let cell2: Cell;
    service.output$.subscribe(data => {
      if (step === 0) {
        cell1 = data
          .filter(c => c.ball !== undefined)
          .pop();
        expect(cell1).toBeTruthy();
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
        return done();
      }
    });
    service.input$.next({ cells });
  })());
});
