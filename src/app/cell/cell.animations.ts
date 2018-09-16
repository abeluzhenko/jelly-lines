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
    'visible',
    style({
      transform: 'scale(1)'
    }),
  ),
  state(
    'void',
    style({
      transform: 'scale(0)'
    }),
  ),
  transition(
    'visible <=> void',
    animate('320ms ease')
  )
]);
