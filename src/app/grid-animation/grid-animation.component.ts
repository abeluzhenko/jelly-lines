import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { AnimationStyleMetadata, style, keyframes, animate, AnimationBuilder } from '@angular/animations';
import { IGridAnimation, GridAnimationType } from '../grid.service';
import { BallComponent } from '../ball/ball.component';
import { MOVING_DURATION } from './grid-animation.animations';
import { Grid } from '../grid.model';
import { ICell } from '../cell/cell.model';
import { IBall } from '../ball/ball.model';

@Component({
  selector: 'app-grid-animation',
  template: `
    <app-ball
      class="ball"
      *ngFor="let ball of data"
      [data]="ball">
    </app-ball>
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
      this.data = [ value.cells[value.cells.length - 1].ball ];
      this._changeDetectorRef.detectChanges();
      const animation = this.buildMoveAnimation(value.cells);
      const player = animation.create(this.balls.first.elementRef.nativeElement);
      player.onDone(() => {
        this.complete.emit();
        this.data = null;
      });
      player.play();
    }
  }

  constructor(
    private _animationBuilder: AnimationBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
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
