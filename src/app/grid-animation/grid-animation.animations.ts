import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  AnimationMetadata,
} from '@angular/animations';

export const APPEAR_DURATION = 320;
export const MATCH_DURATION = 500;
export const MOVING_DURATION = 800;

export function getMatchAnimation(
  position: { x: number, y: number },
  delay: number,
  duration: number = MATCH_DURATION
): AnimationMetadata[] {
  const translate = `translate(${ position.x * 100 }%, ${ position.y * 100 }%)`;
  return [
    style({ transform: `${ translate } scale(1)`, opacity: 1 }),
    animate(`${ duration }ms ${ delay + 1 }ms ease`, keyframes([
      style({ transform: `${ translate } scale(1.6)`, opacity: 1, offset: 0.4 }),
      style({ transform: `${ translate } scale(0)`, opacity: 1, offset: 1 }),
    ])
  )];
}

export function getMoveAnimation(
  path: { x: number, y: number }[],
  duration: number = MOVING_DURATION
): AnimationMetadata {
  const delta = duration / path.length;
  const steps = path.map((p, i) => style({
    transform: `translate(${ p.x * 100 }%, ${ p.y * 100 }%)`,
    offset: delta * i / 1000,
    opacity: 1,
  }));
  return animate(`${ duration }ms ease`, keyframes(steps));
}

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
  transition('void => animated', animate(`1ms ${ MOVING_DURATION }ms`))
]);
