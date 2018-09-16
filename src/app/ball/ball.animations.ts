import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';

export const ballAnimation = trigger('ballAnimation', [
  state(
    'jump_start',
    style({
      transform: 'translate(-50%, -50%) scale(1)'
    }),
  ),
  state(
    'jump_finish',
    style({
      transform: 'translate(-50%, -50%) scale(1)'
    }),
  ),
  transition(
    'jump_start <=> jump_finish',
    animate(
      '1000ms ease',
      keyframes([
        style({ offset: 0.0, transform: 'translate(-50%, -50%) scale(1)' }),
        style({ offset: 0.1, transform: 'translate(-50%, -50%) scale(1.2, 1)' }),
        style({ offset: 0.5, transform: 'translate(-50%, -60%) scale(0.2, 1.2)' }),
      ])
    )
  )
]);
