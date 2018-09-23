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
  }));

  it('should properly add new items to the grid on new step', inject([GridService], (service: GridService) => {
  }));

  it('should properly move the current ball', done => inject([GridService], (service: GridService) => {
    done();
  })());
});
