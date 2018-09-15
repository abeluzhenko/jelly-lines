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
    const cells = service.data;
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        const currentBall = cells[i][j].ball;
        const result = service.setCurrentBall(currentBall);
        expect(result).toBe(currentBall);
        expect(currentBall.state).toBe(BallState.active);
      }
    }
  }));

  it('should properly add new items to the grid', inject([GridService], (service: GridService) => {
    const snapshot = service.data;
    // service.next();
  }));
});
