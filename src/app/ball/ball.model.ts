export enum BallColor {
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  purple = 'purple'
}

export enum BallState {
  idle = 0,
  active = 1,
  animated = 2,
  disabled = 3
}

export interface Ball {
  state: BallState;
  color: BallColor;
}
