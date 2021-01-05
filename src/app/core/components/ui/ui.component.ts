import { Component, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Ball, BallState, UIData } from '../../shared';
import { timer, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-ui',
  template: `
    <div class="ui__score">{{ score }}</div>
    <div class="ui__colors">
      <app-ball class="ui__ball"
                *ngFor="let ball of balls"
                [ball]="ball"></app-ball>
    </div>
    <div class="ui__turn">{{ turn }}</div>
  `,
  styleUrls: ['./ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiComponent implements OnDestroy {
  private _data: UIData;
  private _timerSubscription: Subscription;

  private readonly COUNTER_INTERVAL = 20;

  public balls: Ball[] = [];
  public score = 0;
  public turn = 0;

  @Input() public set data(value: UIData) {
    if (!value) {
      return;
    }

    if (value.nextColors) {
      this.balls = value.nextColors.map((color, i) =>
        ({ id: i, color, state: BallState.idle }));
    }

    this._data = value;

    if (value.score !== this.score) {
      const currentScore = this.score;
      this._timerSubscription = timer(0, this.COUNTER_INTERVAL)
        .pipe(takeWhile((increment) => increment < (value.score - currentScore)))
        .subscribe(() => {
          this.score++;
          this.changeDetectorRef.markForCheck();
        });
    }
    this.turn = value.turn;
  }

  public get data(): UIData {
    return this._data;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    if (this._timerSubscription) {
      this._timerSubscription.unsubscribe();
    }
  }

}
