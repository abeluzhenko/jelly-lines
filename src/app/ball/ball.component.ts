import { Component, OnInit, Input } from '@angular/core';
import { BallState, Ball } from './ball.model';

interface ISpriteClass {
  active: boolean;
}

@Component({
  selector: 'app-ball',
  template: `
  <div class="shadow" [ngClass]="ballClass"></div>
  <div class="ball" [ngClass]="ballClass"></div>
  `,
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {

  @Input() set data(value: Ball) {
    this.spriteClass = {
      active: value.state === BallState.active
    };
    this.spriteClass['color--' + value.state] = true;
  }

  public spriteClass: ISpriteClass;

  constructor() { }

  ngOnInit() {
  }
}
