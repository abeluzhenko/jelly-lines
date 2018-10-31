import {
  style,
  animate,
  keyframes,
  AnimationMetadata,
} from '@angular/animations';

export const APPEAR_DURATION = 320;
export const MATCH_DURATION = 500;
export const MOVING_DURATION = 500;

export function getAddAnimation(
  position: { x: number, y: number },
  delay: number,
  duration: number = APPEAR_DURATION
): AnimationMetadata[] {
  const translate = `translate(${ position.x * 100 }%, ${ position.y * 100 }%)`;
  return [
    style({ transform: `${ translate } scale(0)`, opacity: 1 }),
    animate(`${ duration }ms ${ delay + 1 }ms ease`,
      keyframes([
        style({ transform: `${ translate } scale(1.2)`, offset: 0.4 }),
        style({ transform: `${ translate } scale(1)`, offset: 1 }),
      ]
    )
  )];
}

export function getMatchAnimation(
  position: { x: number, y: number },
  delay: number,
  duration: number = MATCH_DURATION
): AnimationMetadata[] {
  const translate = `translate(${ position.x * 100 }%, ${ position.y * 100 }%)`;
  return [
    style({ transform: `${ translate } scale(1)`, opacity: 1 }),
    animate(`${ duration }ms ${ delay + 1 }ms ease`,
      keyframes([
        style({ transform: `${ translate } scale(1.6)`, opacity: 1, offset: 0.4 }),
        style({ transform: `${ translate } scale(0)`, opacity: 1, offset: 1 }),
      ]
    )
  )];
}

export function getMoveAnimation(
  path: { x: number, y: number }[],
  duration: number = MOVING_DURATION
): AnimationMetadata {
  const delta = 1 / (path.length - 1);
  const steps = path.map((p, i) => style({
    transform: `translate(${ p.x * 100 }%, ${ p.y * 100 }%)`,
    offset: delta * i,
    opacity: 1,
  }));
  return animate(`${ duration }ms ease`, keyframes(steps));
}
