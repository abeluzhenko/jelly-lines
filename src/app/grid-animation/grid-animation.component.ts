import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { AnimationStyleMetadata, style, keyframes, animate, AnimationBuilder } from '@angular/animations';
import { IGridAnimation, GridAnimationType } from '../grid.service';
import { BallComponent } from '../ball/ball.component';
import { MOVING_DURATION, getMatchAnimation, MATCH_DURATION, getMoveAnimation, getAddAnimation } from './grid-animation.animations';
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
    switch (value.type) {
      case GridAnimationType.Add:
        this.data = value.cells.map(cell => cell.ball);
        this._changeDetectorRef.detectChanges();
        const doneList1 = [];

        this.balls.forEach((item, i) => {
          const matchAnimation = this.buildAddAnimation(item.data.id, i * 100);
          const matchPlayer = matchAnimation.create(item.elementRef.nativeElement);
          const done = new Promise(resolve => {
            matchPlayer.onDone(() => {
              matchPlayer.destroy();
              resolve();
            });
          });
          doneList1.push(done);
          matchPlayer.play();
        });
        Promise.all(doneList1).then(() => {
          this.data = null;
        });
        break;
      case GridAnimationType.Move:
        this.data = [ value.cells[value.cells.length - 1].ball ];
        this._changeDetectorRef.detectChanges();

        const moveAnimation = this.buildMoveAnimation(value.cells);
        const movePlayer = moveAnimation.create(this.balls.first.elementRef.nativeElement);
        movePlayer.onDone(() => {
          movePlayer.destroy();
          this.complete.emit();
          this.data = null;
        });
        movePlayer.play();
        break;
      case GridAnimationType.Match:
        this.data = value.cells.map(cell => cell.ball);
        this._changeDetectorRef.detectChanges();
        const doneList2 = [];

        this.balls.forEach((item, i) => {
          const matchAnimation = this.buildMatchAnimation(item.data.id, i * 100);
          const matchPlayer = matchAnimation.create(item.elementRef.nativeElement);
          const done = new Promise(resolve => {
            matchPlayer.onDone(() => {
              matchPlayer.destroy();
              resolve();
            });
          });
          doneList2.push(done);
          matchPlayer.play();
        });
        Promise.all(doneList2).then(() => {
          this.data = null;
        });
        break;
    }
  }

  constructor(
    private _animationBuilder: AnimationBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  private buildAddAnimation(id: number, delay: number, duration = MATCH_DURATION) {
    const position = Grid.getPosition(id);
    return this._animationBuilder.build(getAddAnimation(position, delay, duration));
  }

  private buildMatchAnimation(id: number, delay: number, duration = MATCH_DURATION) {
    const position = Grid.getPosition(id);
    return this._animationBuilder.build(getMatchAnimation(position, delay, duration));
  }

  private buildMoveAnimation(path: ICell[], duration = MOVING_DURATION) {
    const steps = path.map(cell => Grid.getPosition(cell.id));
    return this._animationBuilder.build(getMoveAnimation(steps, duration));
  }

}
