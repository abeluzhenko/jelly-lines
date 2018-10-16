import { GridService } from './grid.service';
import { Cell } from './cell/cell.model';
import { BallColors, BallStates, BallState } from './ball/ball.model';
import { GRID_SIZE } from './path.model';

export class GridServiceMocked extends GridService {

  constructor() {
    super();
  }

  getRandomGrid(state?: BallState, size = GRID_SIZE): Cell[] {
    const result: Cell[] = super.getGrid(size);
    return result.map(cell => ({
      id: cell.id,
      ball: {
        id: cell.id,
        color: BallColors[Math.floor(BallColors.length * Math.random())],
        state: state !== undefined ? state : BallStates[Math.floor(BallStates.length * Math.random())]
      }
    }));
  }
}
