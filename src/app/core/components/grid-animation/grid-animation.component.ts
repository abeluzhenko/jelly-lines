import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { from, Subscription } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { BallComponent } from '../ball/ball.component';
import {
  MOVING_DURATION,
  MATCH_DURATION,
  getMatchAnimation,
  getMoveAnimation,
  getAddAnimation,
  getWrongAnimation,
  WRONG_DURATION,
  APPEAR_DURATION,
  AnimationFunction,
  DELAY_MULTIPLIER,
} from './grid-animation.animations';
import * as Grid from '../../shared/grid';
import { Cell, Ball, GridAnimation, GridAnimationType } from '../../shared';

@Component({
  selector: 'app-grid-animation',
  template: `
    <app-ball
      class='ball'
      *ngFor='let ball of balls'
      [ball]='ball'>
    </app-ball>
  `,
  styleUrls: ['./grid-animation.component.scss']
})
export class GridAnimationComponent implements OnDestroy {
  private queueSubscripion: Subscription;
  private wrongAnimationPlayer: AnimationPlayer;
  private _animationQueue: GridAnimation[] = [];

  public balls: Ball[] = [];

  @ViewChildren(BallComponent) ballsEls: QueryList<BallComponent>;

  @Output() completed: EventEmitter<any> = new EventEmitter<any>();

  @Input() public container: ElementRef;

  @Input() public set animation(value: GridAnimation[]) {
    if (!value) {
      return;
    }

    this._animationQueue = value;
    this.queueSubscripion = from(this._animationQueue)
      .pipe(
        reduce((result: Promise<void>, animation: GridAnimation) =>
          result.then(() => this.playSingle(animation)),
          Promise.resolve(),
        ),
      )
      .subscribe((promise) => promise.then(() => {
        this.queueSubscripion.unsubscribe();
        this._animationQueue = [];
        this.completed.emit();
      }));
  }

  public get animationQueue(): GridAnimation[] {
    return this._animationQueue;
  }

  constructor(
    private animationBuilder: AnimationBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnDestroy() {
    if (this.wrongAnimationPlayer) {
      this.wrongAnimationPlayer.destroy();
    }
    if (this.queueSubscripion) {
      this.queueSubscripion.unsubscribe();
    }
  }

  private playSingle(animation: GridAnimation): Promise<void> {
    switch (animation.type) {
      case GridAnimationType.Add:
        return this.buildGroupAnimation(
          animation.cells,
          getAddAnimation,
          APPEAR_DURATION,
        );

      case GridAnimationType.Move:
        this.balls = [animation.cells[animation.cells.length - 1].ball];
        this.changeDetectorRef.detectChanges();

        const steps = animation.cells.map(({ id }) => Grid.getPosition(id));
        const moveAnimation = this.animationBuilder.build(getMoveAnimation(steps, MOVING_DURATION));

        const movePlayer = moveAnimation.create(this.ballsEls.first.elementRef.nativeElement);
        movePlayer.play();

        return new Promise((resolve) =>
          movePlayer.onDone(() => {
            movePlayer.destroy();
            this.balls = [];
            resolve();
          }));

      case GridAnimationType.Match:
        return this.buildGroupAnimation(
          animation.cells,
          getMatchAnimation,
          MATCH_DURATION,
        );

      case GridAnimationType.Wrong:
        if (!this.wrongAnimationPlayer) {
          const wrongAnimation = this.animationBuilder.build(getWrongAnimation(WRONG_DURATION));
          this.wrongAnimationPlayer = wrongAnimation.create(this.container.nativeElement);
        }

        this.wrongAnimationPlayer.play();

        return new Promise((resolve) =>
          this.wrongAnimationPlayer.onDone(() => resolve())
        );

      default: return Promise.resolve();
    }
  }

  private async buildGroupAnimation(
    cells: Cell[],
    animationFn: AnimationFunction,
    duration: number,
  ): Promise<void> {
    this.balls = cells.map(({ ball }) => ball);

    this.changeDetectorRef.detectChanges();

    const doneList = this.ballsEls.map(({ ball, elementRef }, i) => {
      const animation = this.animationBuilder.build(
        animationFn(
          Grid.getPosition(ball.id),
          i * DELAY_MULTIPLIER,
          duration,
          (cells.length - i) * DELAY_MULTIPLIER,
        )
      );

      const player = animation.create(elementRef.nativeElement);
      player.play();

      return new Promise((resolve) =>
        player.onDone(() => {
          player.destroy();
          resolve();
        })
      );
    });

    return await Promise.all(doneList).then(() => {
      this.balls = [];
    });
  }
}
