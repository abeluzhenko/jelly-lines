export const GRID_SIZE = 10;

export interface PathCell {
  index: number;
  cost?: number;
  order?: number;
  isStart?: boolean;
  isEnd?: boolean;
}


export const getClosestCell = (cells: Set<PathCell>): PathCell => Array
  .from(cells)
  .reduce((min, current) => current.cost < min.cost ? current : min,
    { cost: Number.MAX_VALUE } as PathCell);

export const getAdjacent = (cell: PathCell, grid: PathCell[]): PathCell[] => {
  const result = [];
  if (cell.index < 0 || cell.index >= 100) {
    return result;
  }
  const x = Math.floor(cell.index / 10);
  const y = cell.index % 10;
  if (x - 1 >= 0) {
    result.push(grid[(x - 1) * 10 + y]);
  }
  if (x + 1 < 10) {
    result.push(grid[(x + 1) * 10 + y]);
  }
  if (y - 1 >= 0) {
    result.push(grid[x * 10 + (y - 1)]);
  }
  if (y + 1 < 10) {
    result.push(grid[x * 10 + (y + 1)]);
  }
  return result.filter(el => el !== undefined);
};

const getDistance = (cell0: PathCell, cell1: PathCell): number => {
  const [x0, y0] = [Math.floor(cell0.index / 10), cell0.index % 10];
  const [x1, y1] = [Math.floor(cell1.index / 10), cell1.index % 10];
  return Math.abs(x0 - x1) + Math.abs(y0 - y1);
};

const makePath = (to: PathCell, grid: PathCell[], emptyCellValue = 0) => {
  const result = [];
  const path = [to];
  const index = to.order;
  let current = to;
  for (let i = index; i > 1; i--) {
    const next = getAdjacent(current, grid)
      .filter(cell => cell.order !== emptyCellValue)
      .filter(cell => cell.order <= i - 1)
      .sort((a, b) => b.order - a.order)[0];
    path.push(next);
    current = next;
    result.push(next.index);
  }
  return result;
};

export const getPath = (from: PathCell, to: PathCell, grid: PathCell[]) => {
  const opened = new Set();
  const closed = new Set();
  opened.add(from);
  from.cost = 0;
  let done = false;

  while (opened.size && !done) {
    const openedCell = getClosestCell(opened);
    getAdjacent(openedCell, grid)
      .filter(cell => !closed.has(cell))
      .filter(cell => cell.cost < Number.MAX_VALUE)
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
    return makePath(to, grid);
  }
  return null;
};
