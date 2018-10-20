import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';

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
  transition('void => active', animate('320ms ease')),
  transition('animated => void', animate('1ms')),
  transition('void => animated', animate('1ms 1000ms'))
]);
