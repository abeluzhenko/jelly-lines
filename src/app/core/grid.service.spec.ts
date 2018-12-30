import { TestBed, inject } from '@angular/core/testing';

import { GridService, doWhile, GridAnimationType, SCORE_MULTIPLIER } from './grid.service';
import { BallState, BallColor } from '../shared/Ball';
import { ICell } from '../shared/Cell';
import { Path } from '../shared/Path';
import { Grid } from '../shared/Grid';
import { pipe, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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
    service.input$.next({ cells, nextColors: [], score: 0 });
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
    service.input$.next({ cells, nextColors: [], score: 0 });
    service.input$.next({ cells, cell: cell1, nextColors: [], score: 0 });
    service.input$.next({ cells, cell: cell2, nextColors: [], score: 0 });
  })());

  fit('should properly add new items to the grid on a new step', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);

    const animationSubscription = service.animation$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.type).toBe(GridAnimationType.Add);
      expect(data.cells.length).toEqual(Grid.ITEMS_PER_TURN);
      animationSubscription.unsubscribe();
      done();
    });

    let count = 0;
    const dataSubscription = service.output$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.cells.length).toBe(cells.length);

      // There should be n new balls on the grid
      const fullCells = data.cells.filter(c => c.ball);
      count += Grid.ITEMS_PER_TURN;
      expect(fullCells.length).toBe(count);
      dataSubscription.unsubscribe();
    });

    service.input$.next({ cells, nextColors: [], score: 0 });
  })());

  it('should setup new balls colors on a new turn', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);
    let dataSubscription = service.output$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.cells.length).toBe(cells.length);
      expect(data.nextColors).toBeTruthy();
      expect(data.nextColors.length).toBe(3);
      const existBalls = data.cells
          .filter(cell => cell.ball);
      const nextColors = data.nextColors.sort();
      dataSubscription.unsubscribe();

      dataSubscription = service.output$.subscribe(data2 => {
        expect(data2).toBeDefined();
        const newColors = data.cells
          .filter(cell => cell.ball && !existBalls.some(el => el.id === cell.id))
          .map(cell => cell.ball.color)
          .sort();
        expect(newColors).toBeTruthy();
        expect(newColors.length).toEqual(3);
        expect(newColors).toEqual(nextColors);
        dataSubscription.unsubscribe();
        done();
      });

      service.input$.next(data);
    });

    service.input$.next({ cells, nextColors: [], score: 0 });
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
        return service.input$.next({ cells, cell: cell1, nextColors: [], score: 0  });
      }
      if (step === 1) {
        expect(data.cells[cell1.id].ball).toBeDefined();
        expect(data.cells[cell1.id].ball.state).toBe(BallState.active);
        cell2 = data.cells.filter(c => !c.ball)[0];
        expect(cell2).toBeTruthy();
        step++;
        return service.input$.next({ cells, cell: cell2, nextColors: [], score: 0  });
      }
      if (step === 2) {
        expect(data.cells[cell1.id].ball).toBeUndefined();
        expect(data.cells[cell2.id].ball).toBeDefined();
        expect(data.cells[cell2.id].ball.state).toBe(BallState.idle);
        dataSubscription.unsubscribe();
        return done();
      }
    });
    service.input$.next({ cells, nextColors: [], score: 0  });
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
        return service.input$.next({ cells, cell: targetCell, nextColors: [], score: 0  });
      }
      if (step === 1) {
        expect(data.cells[0].ball).toBeDefined();
        expect(data.cells[0].ball.state).toBe(BallState.active);
        expect(data.cells[targetCell.id].ball).toBeUndefined();
        dataSubscription.unsubscribe();
        return done();
      }
    });
    service.input$.next({ cells, cell: cells[0], nextColors: [], score: 0  });
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
      expect(data.type).toEqual(GridAnimationType.Match);
      animationSubscription.unsubscribe();
    });
    const dataSubscription = service.output$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.score).toEqual(SCORE_MULTIPLIER * 6);
      matches = Grid.getMatches(data.cells);
      expect(matches.length).toBe(0);

      // No new items should be added after the match
      expect(data.cells.some(cell => !!cell.ball)).toBeFalsy();

      dataSubscription.unsubscribe();
      return done();
    });
    service.input$.next({ cells, nextColors: [], score: 0  });
  })());

  it('should properly finish the game when the grid is full', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);
    const animationSubscription = service.animation$.subscribe(data => {
      expect(data).toBeTruthy();
      if (data.type === GridAnimationType.Full) {
        animationSubscription.unsubscribe();
        return done();
      }
    });
    const dataSubscription = service.output$.subscribe(data => {
      const length = data.cells.filter(cell => cell.ball).length;
      if (length === 81) {
        dataSubscription.unsubscribe();
        return;
      }
      service.input$.next({ cells: data.cells, nextColors: [], score: 0  });
    });
    service.input$.next({ cells, nextColors: [], score: 0  });
  })());

  it('doWhile should repeat a stream while the condition is truthy', done => inject([GridService], (service: GridService) => {
    const input$: Subject<number> = new Subject();
    const output$ = doWhile(
      input$,
      (value: number) => !!(value < 10),
      pipe(map(value => value + 1))
    );
    output$.subscribe(value => {
      expect(value).toEqual(10);
      done();
    });
    input$.next(1);
  })());

  it('should properly process matches on new turn', done => inject([GridService], (service: GridService) => {
    const cells = Grid.getGrid(9);
    for (let i = 0; i < 81 - 3; i++) {
      cells[i].ball = { id: i, state: BallState.idle, color: BallColor.blue };
    }
    const dataSubscription1 = service.output$.subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.cells).toBeTruthy();
      const fullCells1 = data.cells.filter(cell => cell.ball);
      expect(fullCells1.length).toBe(0);
      dataSubscription1.unsubscribe();
      const dataSubscription2 = service.output$.subscribe(data2 => {
        const fullCells2 = data2.cells.filter(cell => cell.ball);
        expect(fullCells2.length).toBe(3);
        dataSubscription2.unsubscribe();
        done();
      });
      service.input$.next({
        cells: data.cells,
        nextColors: [ BallColor.blue, BallColor.blue, BallColor.blue ],
        score: 0,
      });
    });
    service.input$.next({
      cells,
      nextColors: [ BallColor.blue, BallColor.blue, BallColor.blue ],
      score: 0
    });
  })());
});
