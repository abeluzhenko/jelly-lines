import { Component, Input } from '@angular/core';
import { BallState, IBall } from './ball.model';

interface ISpriteClass {
  active: boolean;
}

@Component({
  selector: 'app-ball',
  template: `
  <div class="shadow" [ngClass]="spriteClass"></div>
  <div class="ball" [ngClass]="spriteClass"></div>
  `,
  styleUrls: ['./ball.component.scss']
})
export class BallComponent {

  private _data: IBall;

  @Input() public set data(value: IBall) {
    this.spriteClass = {
      active: value.state === BallState.active
    };
    this.spriteClass[value.color] = true;
    this._data = value;
  }
  public get data(): IBall {
    return this._data;
  }

  public spriteClass: ISpriteClass;

}
