export enum BallColor {
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  purple = 'purple'
}

export const BallColors: BallColor[] = [
  BallColor.red,
  BallColor.green,
  BallColor.blue,
  BallColor.yellow,
  BallColor.purple
];

export enum BallState {
  idle = 0,
  active = 1,
  animated = 2,
  disabled = 3
}

export const BallStates = [
  BallState.idle,
  BallState.active,
  BallState.animated,
  BallState.disabled
];

export interface Ball {
  id: number;
  state: BallState;
  color: BallColor;
}
