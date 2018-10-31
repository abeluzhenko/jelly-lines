import { Component, OnInit, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { ICell } from '../cell/cell.model';
import { AnimationStyleMetadata, style, keyframes, animate, AnimationBuilder } from '@angular/animations';
import { Grid } from '../grid.model';
import { MOVING_DURATION } from '../grid/grid.animations';
import { IGridAnimation, GridAnimationType } from '../grid.service';
import { BallComponent } from '../ball/ball.component';
import { QueryList } from '@angular/core/src/render3';
import { IBall } from '../ball/ball.model';

@Component({
  selector: 'app-grid-animation',
  template: `
    <app-ball *ngFor="let ball of data" [data]="ball"></app-ball>
  `,
  styleUrls: ['./grid-animation.component.scss']
})
export class GridAnimationComponent implements OnInit {

  public data: IBall[];

  @ViewChildren(BallComponent) balls: QueryList<BallComponent>;

  @Output() complete: EventEmitter<any> = new EventEmitter<any>();

  @Input() public set animation(value: IGridAnimation) {
    if (!value) {
      return;
    }
    if (value.type === GridAnimationType.Move) {
      this.data = value.cells.map(cell => cell.ball);
      const animation = this.buildMoveAnimation(value.cells);
      const player = animation.create(this.balls[0].elementRef.nativeElement);
      player.onDone(() => {
        this.data = null;
      });
      player.play();
    }
  }

  constructor(
    private _animationBuilder: AnimationBuilder
  ) { }

  ngOnInit() {
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
