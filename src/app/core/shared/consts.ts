export enum BallColor {
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  purple = 'purple',
}

export const BALL_COLORS: BallColor[] = Object.values(BallColor);

// TODO: change to capital case
export enum BallState {
  idle,
  active,
  animated,
}

export enum GridAnimationType {
  None,
  Add,
  Move,
  Match,
  Wrong,
  Full,
}
