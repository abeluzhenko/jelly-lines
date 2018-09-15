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
        const result = service.setCurrentBall(currentBall);
        expect(result).toBe(currentBall);
        expect(currentBall.state).toBe(BallState.active);
      }
    }
  }));

  it('should properly add new items to the grid on new step', inject([GridService], (service: GridService) => {
    service.next();
    const cellsFlat =
      service.cells.reduce((result, row) => result.concat(row), []);
    expect(cellsFlat).toBeTruthy();
    expect(cellsFlat.length).toBe(81);
    const ballsFlat = cellsFlat
      .filter(cell => cell.ball)
      .map(cell => cell.ball);
    expect(ballsFlat.length).toBe(0);
  }));
});
