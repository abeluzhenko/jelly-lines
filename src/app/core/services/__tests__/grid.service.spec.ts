import { inject, TestBed } from '@angular/core/testing';

import { GridService, SCORE_MULTIPLIER } from '../grid.service';
import {
  BallState,
  BallColor,
  StartGameAction,
  GameState,
  SelectCellAction,
  GridAnimationType,
  Cell,
  GridAnimation,
  UIData,
  Ball,
  BALL_COLORS, getInitialState
} from '../../shared';
import * as Grid from '../../shared/grid';
import { getChangedStateMock } from '../grid.mock';

describe('GridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService]
    });
  });

  it('should be created', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));

  it('should properly generate a grid', (done) => inject([GridService], (service: GridService) => {
    service.dispatch(new StartGameAction());
    service.state$.subscribe((state) => {
      expect(state).toBeDefined();
      expect(state.turn).toBeDefined();
      expect(state.turn.cells.length).toBe(state.turn.cells.length);

      const fullCells = state.turn.cells.filter(c => c.ball !== undefined);
      expect(fullCells.length).toBe(Grid.ITEMS_PER_TURN);
      done();
    });
  })());

  describe('start game action', () => {
    // tslint:disable-next-line: no-magic-numbers
    const ballsIndices = [0, 1, 2];
    let initialState: GameState;

    beforeEach(inject([GridService], (service: GridService) => {
      initialState = getInitialState();

      spyOn(service as any, 'getRandomColors')
        .and
        .returnValue(ballsIndices.map(() => BallColor.red));

      spyOn(service as any, 'getRandomOpenCellIndex')
        .and
        .returnValues(...ballsIndices.map(() => 0));
    }));

    it('should return a grid with 3 balls', inject([GridService], (service: GridService) => {
      const expectedCells = initialState.turn.cells.map((cell) => ({
        ...cell,
        ...(
          ballsIndices.includes(cell.id)
            ? { ball: { id: cell.id, color: BallColor.red, state: BallState.idle } }
            : undefined
        )
      }));

      const actualState: GameState = (service as any).getUpdatedState(
        initialState,
        new StartGameAction()
      );

      expect(actualState.turn.cells).toEqual(expectedCells);
    }));

    it('should set initial balls animation', inject([GridService], (service: GridService) => {
      const expectedAnimations: GridAnimation[] = [{
        type: GridAnimationType.Add,
        cells: ballsIndices.map((index) => initialState.turn.cells[index])
      }];

      const actualState: GameState = (service as any).getUpdatedState(
        initialState,
        new StartGameAction()
      );

      expect(actualState.animation).toEqual(expectedAnimations);
    }));

    it('should return an initial ui data', inject([GridService], (service: GridService) => {
      const expectedUI: UIData = {
        turn: 1,
        nextColors: ballsIndices.map(() => BallColor.red),
        score: 0
      };

      const actualState: GameState = (service as any).getUpdatedState(
        initialState,
        new StartGameAction()
      );

      expect(actualState.ui).toEqual(expectedUI);
    }));
  });

  describe('select cell action should', () => {
    const currentCellIndex = 10;
    const selectedCellIndex = 60;
    const defaultBallMock = {
      id: currentCellIndex,
      color: BallColor.red,
      state: BallState.active
    };

    let initialState: GameState;
    let currentCell: Cell;
    let selectedCell: Cell;

    beforeEach(() => {
      initialState = getInitialState();

      currentCell = initialState.turn.cells[currentCellIndex];
      selectedCell = initialState.turn.cells[selectedCellIndex];
    });

    it('select a ball when clicked on', inject([GridService], (service: GridService) => {
      const actualState: GameState = (service as any).getUpdatedState(
        initialState,
        new SelectCellAction(currentCell)
      );

      expect(actualState.turn.cell).toEqual(currentCell);
    }));

    it('set a ball animation when clicked on', inject([GridService], (service: GridService) => {
      const expectedBall: Ball = { ...defaultBallMock };
      currentCell.ball = { ...expectedBall, state: BallState.idle };

      const actualState: GameState = (service as any).getUpdatedState(
        initialState,
        new SelectCellAction(currentCell)
      );

      expect(actualState.turn.cells[currentCellIndex].ball).toEqual(expectedBall);
    }));

    it('switch current ball when clicked on', inject([GridService], (service: GridService) => {
      const changedState = getChangedStateMock(initialState, currentCell);

      const actualState: GameState = (service as any).getUpdatedState(
        changedState,
        new SelectCellAction(selectedCell)
      );

      expect(actualState.turn.cell).toEqual(selectedCell);
    }));

    it('switch current ball animation when clicked on', inject([GridService], (service: GridService) => {
      const expectedBall: Ball = { ...defaultBallMock, state: BallState.idle };
      const changedState = getChangedStateMock(initialState, currentCell);

      currentCell.ball = { ...expectedBall, state: BallState.animated };
      selectedCell.ball = { ...expectedBall };

      const actualState: GameState = (service as any).getUpdatedState(
        changedState,
        new SelectCellAction(selectedCell)
      );

      expect(actualState.turn.cells[currentCellIndex].ball).toEqual(expectedBall);
    }));

    describe('if there is a path to the selected cell', () => {
      let expectedBall: Ball;
      let changedState: GameState;
      let actualState: GameState;

      beforeEach(inject([GridService], (service: GridService) => {
        expectedBall = {
          ...defaultBallMock,
          id: selectedCellIndex,
          state: BallState.idle
        };

        currentCell.ball = { ...defaultBallMock, state: BallState.active };
        selectedCell.ball = undefined;

        changedState = getChangedStateMock(
          getChangedStateMock(initialState, currentCell),
          selectedCell
        );

        actualState = (service as any).getUpdatedState(
          changedState,
          new SelectCellAction(selectedCell)
        );
      }));

      it('move the current ball', () => {
        expect(actualState.turn.cells[selectedCellIndex].ball).toEqual(expectedBall);
      });

      it('clear the current cell', () => {
        expect(actualState.turn.cells[currentCellIndex].ball).toBeUndefined();
      });

      it('add movement animation', () => {
        // tslint:disable-next-line: no-magic-numbers
        const expectedPathIndices = [10, 11, 12, 13, 14, 15, 24, 33, 42, 51];

        expect(actualState.animation).toEqual([{
          type: GridAnimationType.Move,
          cells: [...expectedPathIndices.map((id) => ({ id })), selectedCell]
        }]);
      });
    });

    describe('if a path to the selected cell path is blocked', () => {
      let expectedBall: Ball;
      let changedState: GameState;
      let actualState: GameState;

      beforeEach(inject([GridService], (service: GridService) => {
        expectedBall = { ...defaultBallMock, state: BallState.active };

        currentCell.ball = expectedBall;
        selectedCell.ball = undefined;

        // tslint:disable-next-line: no-magic-numbers
        const blockedCells = [0, 1, 2, 11, 18, 19, 20].map((id) => ({
          id,
          ball: { id, ...defaultBallMock }
        }));

        changedState = getChangedStateMock(
          getChangedStateMock(initialState, currentCell, blockedCells),
          selectedCell
        );

        actualState = (service as any).getUpdatedState(
          changedState,
          new SelectCellAction(selectedCell)
        );
      }));

      it('not move the current ball', () => {
        expect(actualState.turn.cells[selectedCellIndex].ball).toBeUndefined();
      });

      it('not clear the current cell', () => {
        expect(actualState.turn.cells[currentCellIndex].ball).toEqual(expectedBall);
      });

      it('add "wrong" animation', () => {
        expect(actualState.animation).toEqual([{ type: GridAnimationType.Wrong }]);
      });
    });

    describe('process matches', () => {
      // tslint:disable-next-line: no-magic-numbers
      const fullCellsIndices = [56, 57, 58, 59];
      const matchCellsIndices = [...fullCellsIndices, selectedCellIndex];

      let changedState: GameState;
      let actualState: GameState;
      let matchCells: Cell[] = [];

      beforeEach(inject([GridService], (service: GridService) => {
        matchCells = matchCellsIndices.map((id) => ({
          id,
          ball: { ...defaultBallMock, id, state: BallState.idle }
        }));

        currentCell.ball = { ...defaultBallMock, state: BallState.active };

        changedState = getChangedStateMock(initialState, currentCell, matchCells);

        actualState = (service as any).getUpdatedState(
          changedState,
          new StartGameAction()
        );
      }));

      it('add match animation', () => {
        expect(actualState.animation).toEqual([{
          type: GridAnimationType.Match,
          cells: matchCells
        }]);
      });

      it('after movement', () => {
        expect(
          matchCellsIndices.every((id) => !changedState.turn.cells[id].ball)
        ).toBeTruthy();
      });

      xit('on a new turn', inject([GridService], (service: GridService) => {
        // tslint:disable-next-line: no-magic-numbers
        const newTurnCellsIndices = [60, 61, 62];

        spyOn(service as any, 'getRandomOpenCellIndex')
          .and
          .callFake((openCells: Cell[]) =>
            openCells.findIndex(({ id }) => newTurnCellsIndices.includes(id))
          );

        changedState = getChangedStateMock(initialState, currentCell, fullCellsIndices.map((id) => ({
          id,
          ball: { ...defaultBallMock, id }
        })));

        actualState = (service as any).getUpdatedState(
          changedState,
          new StartGameAction()
        );

        expect(
          [...fullCellsIndices, ...newTurnCellsIndices].every((id) => !changedState.turn.cells[id].ball)
        ).toBeTruthy();
      }));

      it('add scores', () => {
        expect(actualState.ui.score).toBe(matchCellsIndices.length * SCORE_MULTIPLIER);
      });
    });

    it('should finish the game when the grid is full', inject([GridService], (service: GridService) => {
      const colorsSet = [BALL_COLORS[0], ...BALL_COLORS];
      const actualState: GameState = (service as any).getUpdatedState(
        getChangedStateMock(
          initialState,
          undefined,
          initialState.turn.cells.map((cell, index) => ({
            ...cell,
            ball: {
              ...defaultBallMock,
              id: cell.id,
              color: colorsSet[index % colorsSet.length]
            }
          }))
        ),
        new StartGameAction()
      );

      expect(actualState.animation[actualState.animation.length - 1])
        .toEqual({ type: GridAnimationType.Full });
    }));

    it('increment a turn number', inject([GridService], (service: GridService) => {
      const actualState: GameState = (service as any).getUpdatedState(
        initialState,
        new StartGameAction()
      );

      expect(actualState.ui.turn).toBe(1);
    }));
  });
});
