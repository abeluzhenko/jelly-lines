export const GRID_SIZE = 9;

export interface IPathCell {
  index: number;
  cost?: number;
  order?: number;
  isStart?: boolean;
  isEnd?: boolean;
}

export class Path {
  public static getPathGrid(cells): IPathCell[] {
    return cells.map((cell, index) => ({
      index,
      order: 0,
      cost: cell.ball ? Number.POSITIVE_INFINITY : 1
    }));
  }

  public static getClosestCell(cells: Set<IPathCell>): IPathCell {
    return Array
      .from(cells)
      .reduce(
        (min, current) => current.cost < min.cost ? current : min,
        { cost: Number.POSITIVE_INFINITY } as IPathCell
      );
  }

  public static getAdjacent(
    cell: IPathCell,
    grid: IPathCell[],
    gridSize = GRID_SIZE
  ): IPathCell[] {
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
  }

  public static getDistance(
    cell0: IPathCell,
    cell1: IPathCell,
    gridSize = GRID_SIZE
  ): number {
    const [x0, y0] = [Math.floor(cell0.index / gridSize), cell0.index % gridSize];
    const [x1, y1] = [Math.floor(cell1.index / gridSize), cell1.index % gridSize];
    return Math.abs(x0 - x1) + Math.abs(y0 - y1);
  }

  public static makePath(
    from: IPathCell,
    grid: IPathCell[],
    adjacentFn: Function,
    emptyCellValue = 0,
    gridSize = GRID_SIZE
  ) {
    const path = [from];
    const index = from.order;
    let current = from;
    for (let i = index; i > 1; i--) {
      const next = adjacentFn(current, grid, gridSize)
        .filter(cell => cell.order !== emptyCellValue)
        .filter(cell => cell.order === i - 1)[0];
      if (!next) {
        return [];
      }
      path.push(next);
      current = next;
    }
    return path.reverse();
  }

  public static getPath(
    from: IPathCell,
    to: IPathCell,
    grid: IPathCell[],
    emptyValue = 0,
    gridSize = GRID_SIZE
  ) {

    if (Path.getDistance(from, to, gridSize) === 1) {
      return [from, to];
    }

    const opened = new Set();
    const closed = new Set();
    opened.add(from);
    from.cost = 1;
    let done = false;

    const filterCell = cell => !closed.has(cell) && cell.cost < Number.POSITIVE_INFINITY;

    while (opened.size && !done) {
      const openedCell = Path.getClosestCell(opened);
      Path.getAdjacent(openedCell, grid, gridSize)
        .filter(cell => filterCell(cell))
        .forEach(cell => {
          // Add cell to the new list
          opened.add(cell);
          // If the current cell cost is higher
          // than the new one then return
          const cost = openedCell.order + 1 + Path.getDistance(cell, to, gridSize);
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
      return [from, ...Path.makePath(to, grid, Path.getAdjacent, emptyValue, gridSize)];
    }
    return [];
  }
}
