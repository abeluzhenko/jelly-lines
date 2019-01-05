import {
  style,
  animate,
  keyframes,
  AnimationMetadata,
} from '@angular/animations';

export const APPEAR_DURATION = 320;
export const MATCH_DURATION = 420;
export const MOVING_DURATION = 480;
export const WRONG_DURATION = 420;

export type AnimationFunction = (
  position: { x: number, y: number },
  delay: number,
  duration?: number,
  delayAfter?: number,
) => AnimationMetadata[];

export function getAddAnimation(
  position: { x: number, y: number },
  delay: number,
  duration: number = APPEAR_DURATION,
  delayAfter: number = 0,
): AnimationMetadata[] {
  const translate = `translate3d(${ position.x * 100 }%, ${ position.y * 100 }%, 1px)`;
  return [
    style({ transform: `${ translate } scale(0)`, opacity: 1 }),
    animate(`${ duration }ms ${ delay + 1 }ms ease`,
    // animate(`${ duration }ms ease`,
      keyframes([
        style({ transform: `${ translate } scale(1.1)`, offset: 0.75 }),
        style({ transform: `${ translate } scale(1)`, offset: 1 }),
      ],
    )),
    animate(`${ delayAfter + 1 }ms ease`,
      style({ transform: `${ translate } scale(1)`, opacity: 1 })),
  ];
}

export function getMatchAnimation(
  position: { x: number, y: number },
  delay: number,
  duration: number = MATCH_DURATION
): AnimationMetadata[] {
  const translate = `translate3d(${ position.x * 100 }%, ${ position.y * 100 }%, 1px)`;
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
    transform: `translate3d(${ p.x * 100 }%, ${ p.y * 100 }%, 1px)`,
    offset: delta * i,
    opacity: 1,
  }));
  return animate(`${ duration }ms ease-out`, keyframes(steps));
}

export function getWrongAnimation(
  duration: number = MOVING_DURATION
): AnimationMetadata[] {
  return [
    animate(`${ duration }ms ease`,
      keyframes([
        style({ transform: `translateX(10px)`, offset: 0.25 }),
        style({ transform: `translateX(-10px)`, offset: 0.5 }),
        style({ transform: `translateX(5px)`, offset: 0.75 }),
        style({ transform: `translateX(-5px)`, offset: 0.9 }),
        style({ transform: `translateX(0)`, offset: 1 }),
      ]
    )
  )];
}
