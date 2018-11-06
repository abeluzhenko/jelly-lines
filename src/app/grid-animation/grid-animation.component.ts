import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer } from '@angular/animations';
import { IGridAnimation, GridAnimationType } from '../grid.service';
import { BallComponent } from '../ball/ball.component';
import {
  MOVING_DURATION,
  MATCH_DURATION,
  getMatchAnimation,
  getMoveAnimation,
  getAddAnimation,
  getWrongAnimation,
  WRONG_DURATION,
  APPEAR_DURATION
} from './grid-animation.animations';
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
export class GridAnimationComponent implements OnInit, OnDestroy {

  private _wrongAnimationPlayer: AnimationPlayer;

  public data: IBall[];

  @ViewChildren(BallComponent) balls: QueryList<BallComponent>;

  @Output() complete: EventEmitter<any> = new EventEmitter<any>();

  @Input() public container: ElementRef;

  @Input() public set animation(value: IGridAnimation) {
    if (!value) {
      return;
    }
    switch (value.type) {
      case GridAnimationType.Add:
        this.buildGroupAnimation(value.cells, getAddAnimation, APPEAR_DURATION);
        break;
      case GridAnimationType.Move:
        this.data = [ value.cells[value.cells.length - 1].ball ];
        this._changeDetectorRef.detectChanges();

        const steps = value.cells.map(cell => Grid.getPosition(cell.id));
        const moveAnimation = this._animationBuilder.build(getMoveAnimation(steps, MOVING_DURATION));
        const movePlayer = moveAnimation.create(this.balls.first.elementRef.nativeElement);
        movePlayer.onDone(() => {
          movePlayer.destroy();
          this.complete.emit();
          this.data = null;
        });
        movePlayer.play();
        break;
      case GridAnimationType.Match:
        this.buildGroupAnimation(value.cells, getMatchAnimation, MATCH_DURATION);
        break;
      case GridAnimationType.Wrong:
        if (!this._wrongAnimationPlayer) {
          const wrongAnimation = this._animationBuilder.build(getWrongAnimation(WRONG_DURATION));
          this._wrongAnimationPlayer = wrongAnimation.create(this.container.nativeElement);
        }
        this._wrongAnimationPlayer.play();
        break;
    }
  }

  constructor(
    private _animationBuilder: AnimationBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._wrongAnimationPlayer.destroy();
  }

  private buildGroupAnimation(
    cells: ICell[],
    animationFn: (
      position: { x: number, y: number },
      delay: number,
      d: number
    ) => AnimationMetadata[],
    duration
  ): Promise<any> {
    this.data = cells.map(cell => cell.ball);
    this._changeDetectorRef.detectChanges();
    const doneList = [];

    this.balls.forEach((item, i) => {
      const animation = this._animationBuilder.build(
        animationFn(Grid.getPosition(item.data.id), i * 100, duration));
      const player = animation.create(item.elementRef.nativeElement);
      const done = new Promise(resolve => {
        player.onDone(() => {
          player.destroy();
          resolve();
        });
      });
      doneList.push(done);
      player.play();
    });
    return Promise.all(doneList).then(() => {
      this.data = null;
    });
  }
}
