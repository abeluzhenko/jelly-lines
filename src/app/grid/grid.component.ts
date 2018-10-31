import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
    <app-ball
      class="animation"
      #animatedBall
      [style.visibility]="animatedData ? 'visible' : 'hidden'"
      [data]="animatedData"></app-ball>
  `,
  styleUrls: ['./grid.component.scss'],
  animations: [ cellBallAnimation ]
})
export class GridComponent implements OnInit {

  @Input() public data: ITurnData;

  @Input() public set animation(value: IGridAnimation) {
    if (!value) {
      return;
    }
    if (value.type === GridAnimationType.Move) {
      const ballData = value.cells[value.cells.length - 1].ball;
      const animation = this.buildMoveAnimation(value.cells);
      const player = animation.create(this.animatedBall.elementRef.nativeElement);
      this.animatedData = ballData;
      player.onDone(() => {
        this.animatedData = null;
        this.next({
          cells: this.data.cells,
          score: this.data.score,
          nextColors: this.data.nextColors,
        });
      });
      player.play();
    }
  }

  @Output() input: EventEmitter<ITurnData> = new EventEmitter<ITurnData>();

  @ViewChild('animatedBall') animatedBall: BallComponent;
  public animatedData: IBall;

  constructor(
    private _animationBuilder: AnimationBuilder
  ) {}

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

  private next(data: ITurnData) {
    this.input.emit(data);
  }

  private buildMoveAnimation(data: ICell[], duration = MOVING_DURATION) {
    const delta = duration / data.length;
    const steps: AnimationStyleMetadata[] = data
      .map((cell, i) => {
        const position = Grid.getPosition(cell.id);
        return style({
          transform: `translate(${ position.x * 100 }%, ${ position.y * 100 }%)`,
          offset: delta * i / 1000
        });
      });
    return this._animationBuilder.build([
      animate(`${ duration }ms ease`, keyframes(steps))
    ]);
  }

}
