import { Component, OnInit, Input, HostBinding, Output, EventEmitter, HostListener } from '@angular/core';
import { BallColor, BallState, Ball } from './ball.model';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {

  @Input() data: Ball;
  @Output() clicked: EventEmitter<Ball> = new EventEmitter<Ball>();

  public BALL_STATE = BallState;
  public BALL_COLOR = BallColor;

  constructor() { }

  @HostListener('click', [ '$event' ])
  onClick(event: Event) {
    this.clicked.emit(this.data);
    if (event.stopPropagation) {
      event.stopPropagation();
    }
  }

  ngOnInit() {
  }
}
