import { TestBed, inject } from '@angular/core/testing';

import { GridService } from './grid.service';
import { BallState } from './ball/ball.model';

describe('GridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService]
    });
  });

  it('should be created', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));

  it('should properly set current ball', inject([GridService], (service: GridService) => {
    service.randomize();
    const cells = service.cells;
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        const currentBall = cells[i][j].ball;
        service.currentBall = currentBall;
        expect(service.currentBall).toBe(currentBall);
        expect(currentBall.state).toBe(BallState.active);
        expect(service.currentCell).toBeNull();
      }
    }
  }));

  it('should properly add new items to the grid on new step', inject([GridService], (service: GridService) => {
    let next = service.next();
    let cellsFlat = [];
    let ballsFlat = [];
    let i = 1;
    while (next && i < 100) {
      expect(next).toBeTruthy();
      cellsFlat =
        service.cells.reduce((result, row) => result.concat(row), []);
      expect(cellsFlat).toBeTruthy();
      expect(cellsFlat.length).toBe(81);
      ballsFlat = cellsFlat
        .filter(cell => cell.ball)
        .map(cell => cell.ball);
      expect(ballsFlat.length).toBe(3 * i);
      next = service.next();
      i++;
    }
    expect(cellsFlat.length).toBe(81);
    expect(cellsFlat.length).toBe(81);
  }));

  it('should properly move the current ball', inject([GridService], (service: GridService) => {
    service.next();
    const fullCellsFlat = service.cells
      .reduce((result, row) => result.concat(row), [])
      .filter(c => c.ball);
    expect(fullCellsFlat.length);
    const cell = fullCellsFlat.pop();
    expect(cell).toBeTruthy();
    expect(cell.ball).toBeTruthy();

    service.currentBall = cell.ball;
    service.currentCell = cell;
  }));
});
