import { Component, Input, ElementRef } from '@angular/core';
import { BallState, IBall } from '../shared/Ball';

interface ISpriteClass {
  active: boolean;
}

@Component({
  selector: 'app-ball',
  template: `
  <div class="shadow" [ngClass]="getSpriteClass(data)"></div>
  <div class="ball" [ngClass]="getSpriteClass(data)"></div>
  `,
  styleUrls: ['./ball.component.scss']
})
export class BallComponent {

  @Input() public data: IBall;

  public getSpriteClass(value: IBall): ISpriteClass {
    if (!value) {
      return null;
    }
    const spriteClass = {
      'active': value.state === BallState.active
    };
    spriteClass[value.color] = true;
    return spriteClass;
  }

  constructor(
    public elementRef: ElementRef
  ) {}
}