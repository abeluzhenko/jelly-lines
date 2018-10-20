import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';

export const APPEAR_DURATION = 320;
export const MOVING_DURATION = 800;

export const cellBallAnimation = trigger('cellBallAnimation', [
  state(
    'active',
    style({ transform: 'scale(1)' }),
  ),
  state(
    'animated',
    style({ transform: 'scale(1)' }),
  ),
  state(
    'void',
    style({ transform: 'scale(0)' }),
  ),
  transition('void => active', animate(`${ APPEAR_DURATION }ms ease`)),
  transition('animated => void', animate('1ms')),
  transition('void => animated', animate(`1ms ${ MOVING_DURATION }ms`))
]);
