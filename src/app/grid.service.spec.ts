import { TestBed, inject } from '@angular/core/testing';

import { GridService } from './grid.service';
import { BallState, BallColor } from './ball/ball.model';
import { GridServiceMocked } from './grid-mocked.service';

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

    service.output.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.length).toBe(cells.length);

      // There should be n new balls on the grid
      const fullCells = data.filter(c => c.ball !== undefined);
      expect(fullCells.length).toBe(3);

      done();
    });
    service.input.next({ cells });
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
    service.output.subscribe(data => {
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
    service.input.next({ cells });
    service.input.next({ cells, cell: cell1 });
    service.input.next({ cells, cell: cell2 });
  })());

  it('should properly add new items to the grid on a new step', inject([GridService], (service: GridService) => {
  }));

  it('should properly move the current ball', done => inject([GridService], (service: GridService) => {
    done();
  })());
});
