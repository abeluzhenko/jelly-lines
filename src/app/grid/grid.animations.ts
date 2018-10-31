import { trigger, state, style, transition, animate } from '@angular/animations';
import { APPEAR_DURATION, MOVING_DURATION } from '../grid-animation/grid-animation.animations';

export const cellBallAnimation = trigger('cellBallAnimation', [
  state(
    'active',
    style({ transform: 'scale(1)' }),
  ),
  state(
    'void',
    style({ transform: 'scale(0)' }),
  ),
  transition('void => active', animate(`1ms ${ MOVING_DURATION }ms`))
]);
