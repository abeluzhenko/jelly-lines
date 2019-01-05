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
import { from, Subscription } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer } from '@angular/animations';
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
import { Grid } from '../shared/Grid';
import { ICell } from '../shared/Cell';
import { IBall } from '../shared/Ball';
import { IGridAnimation, GridAnimationType } from 'src/app/core/shared/GridAnimation';

@Component({
  selector: 'app-grid-animation',
  template: `
    <app-ball
      class='ball'
      *ngFor='let ball of data'
      [data]='ball'>
    </app-ball>
  `,
  styleUrls: ['./grid-animation.component.scss']
})
export class GridAnimationComponent implements OnDestroy {

  private _queueSubscripion: Subscription;
  private _wrongAnimationPlayer: AnimationPlayer;
  private _animationQueue: IGridAnimation[] = [];
  public data: IBall[];

  @ViewChildren(BallComponent) balls: QueryList<BallComponent>;
  @Output() completed: EventEmitter<any> = new EventEmitter<any>();
  @Input() public container: ElementRef;
  @Input() public set animation(value: IGridAnimation[]) {
    if (!value) {
      return;
    }
    this._animationQueue = value;
    this._queueSubscripion = from(this._animationQueue)
      .pipe(
        reduce((result: Promise<any>, animation: IGridAnimation) =>
          result.then(() => this.playSingle(animation)), Promise.resolve()),
      )
      .subscribe((promise) => promise.then(() => {
        this._queueSubscripion.unsubscribe();
        this._animationQueue = [];
        this.completed.emit();
      }));
  }

  public get animationQueue(): IGridAnimation[] {
    return this._animationQueue;
  }

  constructor(
    private _animationBuilder: AnimationBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnDestroy() {
    if (this._wrongAnimationPlayer) {
      this._wrongAnimationPlayer.destroy();
    }
    if (this._queueSubscripion) {
      this._queueSubscripion.unsubscribe();
    }
  }

  private playSingle(animation: IGridAnimation): Promise<any> {
    switch (animation.type) {
      case GridAnimationType.Add:
        return this.buildGroupAnimation(
          animation.cells,
          getAddAnimation,
          APPEAR_DURATION,
        );

      case GridAnimationType.Move:
        this.data = [ animation.cells[animation.cells.length - 1].ball ];
        this._changeDetectorRef.detectChanges();

        const steps = animation.cells.map(cell => Grid.getPosition(cell.id));
        const moveAnimation = this._animationBuilder.build(getMoveAnimation(steps, MOVING_DURATION));
        const movePlayer = moveAnimation.create(this.balls.first.elementRef.nativeElement);
        movePlayer.play();

        return new Promise((resolve) =>
          movePlayer.onDone(() => {
            movePlayer.destroy();
            this.data = null;
            resolve();
          }));

      case GridAnimationType.Match:
        return this.buildGroupAnimation(
          animation.cells,
          getMatchAnimation,
          MATCH_DURATION,
        );

      case GridAnimationType.Wrong:
        if (!this._wrongAnimationPlayer) {
          const wrongAnimation = this._animationBuilder.build(getWrongAnimation(WRONG_DURATION));
          this._wrongAnimationPlayer = wrongAnimation.create(this.container.nativeElement);
        }
        this._wrongAnimationPlayer.play();
        return new Promise((resolve) =>
          this._wrongAnimationPlayer.onDone(() => resolve()));

      default: return Promise.resolve();
    }
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
    return Promise
      .all(doneList)
      .then(() => this.data = null);
  }
}
