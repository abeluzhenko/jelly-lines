export enum BallColor {
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  purple = 'purple'
}

export const BallColors = [
  'red',
  'green',
  'blue',
  'yellow',
  'purple'
];

export enum BallState {
  idle = 0,
  active = 1,
  animated = 2,
  disabled = 3
}

export class Ball {
  id: number;
  state: BallState;
  color: BallColor;
  constructor(
    id: number,
    color: BallColor = BallColor.red,
    state: BallState = BallState.idle
  ) {
    this.id = id;
    this.state = state;
    this.color = color;
  }
}
