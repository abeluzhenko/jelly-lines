import { Component, Input, ElementRef } from '@angular/core';
import { BallState, Ball } from '../../shared';

interface SpriteClass {
  [key: string]: boolean;
  active?: boolean;
}

@Component({
  selector: 'app-ball',
  template: `
  <div class="shadow"
       [ngClass]="spriteClass"></div>
  <div class="ball"
       [ngClass]="spriteClass"></div>
  `,
  styleUrls: ['./ball.component.scss']
})
export class BallComponent {
  @Input() public ball: Ball;

  get spriteClass(): SpriteClass {
    return this.ball && {
      [this.ball.color]: true,
      active: this.ball.state === BallState.active,
    };
  }

  constructor(
    public elementRef: ElementRef
  ) {}
}
