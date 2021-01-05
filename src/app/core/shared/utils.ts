import {getGrid} from './grid';

export const cloneDeep = <T extends any>(value: T): T => JSON.parse(JSON.stringify(value));

export const getInitialState = () => ({
  turn: {
    cells: getGrid(),
  },
  ui: {
    nextColors: [],
      score: 0,
      turn: 0,
  },
  animation: []
});
