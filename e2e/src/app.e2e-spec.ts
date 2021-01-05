import { Application } from './app.po';
import { $, browser } from 'protractor';
import { getInitialState, BallColor, BallState } from '../../src/app/core/shared';
import { getChangedStateMock } from '../../src/app/core/services/grid.mock';

describe('App', () => {
  let app: Application;

  beforeEach(() => {
    app = new Application();

    app.navigateTo();
  });

  afterEach(() => {
    app.clearStorage();
  });

  it('should create app', () => {
    expect($('app-game').getText()).toBeTruthy();
  });

  it('should restore state data from localStorage', () => {
    const initialState = getChangedStateMock(getInitialState(), null, [{
      id: 0,
      ball: { id: 0, color: BallColor.red, state: BallState.active }
    }]);

    app.saveStateToStorage(getChangedStateMock(initialState, initialState.turn.cells[0]));
    app.navigateTo();

    // tslint:disable-next-line: no-magic-numbers
    browser.sleep(500);

    expect($('app-ball .ball.active').isPresent()).toBeTruthy();
  });
});
