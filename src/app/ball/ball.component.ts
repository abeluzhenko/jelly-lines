import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BallColor, BallState, Ball } from './ball.model';

@Component({
  selector: 'app-ball',
  template: `
  <div class="shadow" [ngClass]="{
    'active': data?.state === BALL_STATE.active
  }"></div>
  <div class="ball" [ngClass]="{
    'color--red': data?.color === ${ BallColor.red },
    'color--green': data?.color === ${ BallColor.green },
    'color--yellow': data?.color === ${ BallColor.yellow },
    'color--blue': data?.color === ${ BallColor.blue },
    'color--purple': data?.color === ${ BallColor.purple },
    'active': data?.state === ${ BallState.active }
  }"></div>
  `,
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {

  @Input() data: Ball;
  @Output() clicked: EventEmitter<Ball> = new EventEmitter<Ball>();

  constructor() { }

  ngOnInit() {
  }
}
