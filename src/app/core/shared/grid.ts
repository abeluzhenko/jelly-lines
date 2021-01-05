import {BALL_COLORS, BallColor, BallState} from './consts';
import {Cell} from './types';


const SIZE = 9;
const MATCH_LENGTH = 5;

export const ITEMS_PER_TURN = 3;

export const getRandomColor = (): BallColor =>
  BALL_COLORS[Math.floor(BALL_COLORS.length * Math.random())];

export const getGrid = (size: number = SIZE): Cell[] =>
  Array.from({ length: size * size }, (_el, id) => ({ id }));

export const getRandomGrid = (size: number = SIZE): Cell[] =>
  Array.from({ length: size * size }, (_el, id) => ({
    id,
    ball: {
      id,
      color: getRandomColor(),
      state: BallState.idle
    }
  }));

export const getPosition = (
  index: number,
  gridSize = SIZE
): { x: number, y: number } => ({
  y: Math.floor(index / gridSize),
  x: index % gridSize,
});

const isAdjacent = (cellA: Cell, cellB: Cell, gridSize: number): boolean => {
  const [[ax, ay], [bx, by]] = [cellA, cellB].map(({ id }) =>
    [Math.floor(id / gridSize), id % gridSize]);

  const [dx, dy] = [Math.abs(ax - bx), Math.abs(ay - by)];

  return (dx === 1 && dy === 1) || (!dx && dy === 1) || (!dy && dx === 1);
};

interface MatchingItem {
  cell: Cell;
  slope: number;
}

const SLOPE_ROW = 1000;
const SLOPE_COLUMN = -1000;
const SLOPE_CURRENT = -2000;

export const getSortedGrid = (grid: Cell[], index: number, gridSize: number): MatchingItem[] => {
  const currentItem = grid[index];
  const { x: currentX, y: currentY} = getPosition(index, gridSize);

  return grid
    .slice(index)
    .filter(({ ball }) => ball && ball.color === currentItem.ball.color)
    .map((cell) => {
      const { x, y } = getPosition(cell.id, gridSize);
      let slope;

      if (cell.id === currentItem.id) {
        slope = SLOPE_CURRENT;
      } else if (currentX === x) {
        slope = SLOPE_ROW;
      } else if (currentY === y) {
        slope = SLOPE_COLUMN;
      } else {
        slope = (y - currentY) / (x - currentX);
      }

      return { cell, slope };
    })
    .sort((a, b) => a.slope > b.slope
      ? 1
      : (a.slope < b.slope
          ? -1
          : a.cell.id - b.cell.id
        )
    );
};

const getSequences = (
  flatGrid: MatchingItem[],
  matches: Cell[][],
  { gridSize, matchLength }: {
    gridSize: number;
    matchLength: number;
  }
) => {
  const SORTING_START_INDEX = 2;

  if (flatGrid.length < matchLength) { return []; }

  const primeItem = flatGrid[0];
  let lastItem = flatGrid[1];

  let lastSequenceItem = isAdjacent(primeItem.cell, lastItem.cell, gridSize)
    ? lastItem
    : primeItem;

  const sequences = [];
  let sequence = [];

  for (let i = SORTING_START_INDEX; i <= flatGrid.length; i++) {
    const currentItem = flatGrid[i];

    if (
      currentItem &&
      currentItem.slope === lastItem.slope &&
      isAdjacent(lastSequenceItem.cell, currentItem.cell, gridSize)
    ) {
      if (!sequence.length) {
        sequence.push(lastItem);
      }
      sequence.push(currentItem);

      lastSequenceItem = currentItem;
      lastItem = currentItem;

      continue;
    }

    if (sequence.length >= matchLength - 1) {
      const newSequence = [primeItem, ...sequence].map(({ cell }) => cell);
      const isUniqMatch = !matches.some(
        (match) => match[match.length - 1].id === newSequence[newSequence.length - 1].id
      );

      if (isUniqMatch) {
        sequences.push(newSequence);
      }
    }

    if (currentItem) {
      sequence = [];
      lastItem = currentItem;
      lastSequenceItem = isAdjacent(primeItem.cell, lastItem.cell, gridSize)
        ? lastItem
        : primeItem;
    }
  }
  return sequences;
};

export const getMatches = (
  grid: Cell[],
  { matchLength = MATCH_LENGTH, gridSize = SIZE }: { matchLength?: number, gridSize?: number } = {}
): Cell[][] =>
  grid.slice(0, -matchLength + 1).reduce((accumulator, value, index) => {
    if (!value.ball) {
      return accumulator;
    }

    return [
      ...accumulator,
      ...getSequences(
        getSortedGrid(grid, index, gridSize),
        accumulator,
        { gridSize, matchLength }
      )
    ];
  }, []);
