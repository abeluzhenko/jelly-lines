import { GridService, DEFAULT_GRID_SIZE } from './grid.service';
import { Cell } from './cell/cell.model';
import { BallColors, BallColor, BallStates } from './ball/ball.model';

export class GridServiceMocked extends GridService {

  constructor() {
    super();
  }

  getRandomGrid(size = DEFAULT_GRID_SIZE): Cell[] {
    const result: Cell[] = super.getGrid(size);
    return result.map(cell => ({
      id: cell.id,
      ball: {
        id: cell.id,
        color: BallColors[Math.floor(BallColors.length * Math.random())],
        state: BallStates[Math.floor(BallStates.length * Math.random())]
      }
    }));
  }
}
