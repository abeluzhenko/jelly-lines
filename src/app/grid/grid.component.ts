import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { AnimationBuilder, keyframes, animate, AnimationStyleMetadata, style } from '@angular/animations';
import { ITurnData, IGridAnimation, GridAnimationType } from '../grid.service';
import { ICell } from '../cell/cell.model';
import { Grid } from '../grid.model';
import { BallComponent } from '../ball/ball.component';
import { IBall } from '../ball/ball.model';
import { cellBallAnimation, MOVING_DURATION } from './grid.animations';

@Component({
  selector: 'app-grid',
  template: `
    <app-cell
      *ngFor="let cell of data?.cells"
      [data]="cell"
      (clicked)="cellClicked($event)"
      (ballClicked)="ballClicked($event)">
      <app-ball
        *ngIf="cell.ball"
        [@cellBallAnimation]="animatedData?.id === cell.id ? 'animated' : 'active'"
        [data]="cell.ball"></app-ball>
    </app-cell>
    <app-grid-animation
      [data]="animation"
      (complete)="animationCompleted()"></app-grid-animation>
  `,
  styleUrls: ['./grid.component.scss'],
  animations: [ cellBallAnimation ]
})
export class GridComponent implements OnInit {

  @Input() public data: ITurnData;

  @Input() public animation: IGridAnimation;

  @Output() input: EventEmitter<ITurnData> = new EventEmitter<ITurnData>();

  constructor() {}

  ngOnInit() {
  }

  cellClicked(cell: ICell) {
    this.next({
      cell,
      cells: this.data.cells,
      score: this.data.score,
      nextColors: this.data.nextColors
    });
  }

  animationCompleted() {
    this.next({
      cells: this.data.cells,
      score: this.data.score,
      nextColors: this.data.nextColors,
    });
  }

  private next(data: ITurnData) {
    this.input.emit(data);
  }
}
