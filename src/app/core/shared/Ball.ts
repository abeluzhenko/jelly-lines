export enum BallColor {
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  purple = 'purple',
}

export const BALL_COLORS: BallColor[] = Object.values(BallColor);

export enum BallState {
  idle,
  active,
  animated,
  disabled,
}

export const BALL_STATES: BallState[] = <BallState[]> Object.values(BallState);

export interface Ball {
  id: number;
  state: BallState;
  color: BallColor;
}
