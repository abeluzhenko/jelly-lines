export const GRID_SIZE = 10;

export interface PathCell {
  index: number;
  cost?: number;
  order?: number;
  isStart?: boolean;
  isEnd?: boolean;
}

export const getGrid = cells => cells.map((cell, index) => ({
  index,
  order: 0,
  cost: cell.ball ? Number.POSITIVE_INFINITY : 1
}));

export const getClosestCell = (cells: Set<PathCell>): PathCell => Array
  .from(cells)
  .reduce((min, current) => current.cost < min.cost ? current : min,
    { cost: Number.POSITIVE_INFINITY } as PathCell);

export const getAdjacent = (
  cell: PathCell,
  grid: PathCell[],
  gridSize = GRID_SIZE
): PathCell[] => {
  const result = [];
  if (cell.index < 0 || cell.index >= gridSize * gridSize) {
    return result;
  }
  const x = Math.floor(cell.index / gridSize);
  const y = cell.index % gridSize;
  if (x - 1 >= 0) {
    result.push(grid[(x - 1) * gridSize + y]);
  }
  if (x + 1 < gridSize) {
    result.push(grid[(x + 1) * gridSize + y]);
  }
  if (y - 1 >= 0) {
    result.push(grid[x * gridSize + (y - 1)]);
  }
  if (y + 1 < gridSize) {
    result.push(grid[x * gridSize + (y + 1)]);
  }
  return result.filter(el => el !== undefined);
};

export const getDistance = (
  cell0: PathCell,
  cell1: PathCell,
  gridSize = GRID_SIZE
): number => {
  const [x0, y0] = [Math.floor(cell0.index / gridSize), cell0.index % gridSize];
  const [x1, y1] = [Math.floor(cell1.index / gridSize), cell1.index % gridSize];
  return Math.abs(x0 - x1) + Math.abs(y0 - y1);
};

export const makePath = (
  from: PathCell,
  grid: PathCell[],
  adjacentFn: Function,
  emptyCellValue = 0
) => {
  const path = [from];
  const index = from.order;
  let current = from;
  for (let i = index; i > 1; i--) {
    const next = adjacentFn(current, grid)
      .filter(cell => cell.order !== emptyCellValue)
      .filter(cell => cell.order === i - 1)[0];
    if (!next) {
      return [];
    }
    path.push(next);
    current = next;
  }
  return path.reverse();
};

export const getPath = (from: PathCell, to: PathCell, grid: PathCell[]) => {
  const opened = new Set();
  const closed = new Set();
  opened.add(from);
  from.cost = 1;
  let done = false;

  while (opened.size && !done) {
    const openedCell = getClosestCell(opened);
    getAdjacent(openedCell, grid)
      .filter(cell => !closed.has(cell))
      .filter(cell => cell.cost < Number.POSITIVE_INFINITY)
      .forEach(cell => {
        // Add cell to the new list
        opened.add(cell);
        // If the current cell cost is higher
        // than the new one then return
        const cost = openedCell.order + 1 + getDistance(cell, to);
        if (cost <= cell.cost) {
          return;
        }
        // Update cell cost
        cell.cost = cost;
        cell.order = openedCell.order + 1;
        // If the current cell is the to then end loop
        if (cell === to) {
          done = true;
          return;
        }
    });
    // add current cell to the closed list
    closed.add(openedCell);
    // remove from the opened list
    opened.delete(openedCell);
  }
  if (done) {
    return [from, ...makePath(to, grid, getAdjacent)];
  }
  return null;
};
