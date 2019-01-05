import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { IBall, BallState } from '../shared/Ball';
import { timer, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { IUIData } from 'src/app/core/shared/UIData';

@Component({
  selector: 'app-ui',
  template: `
    <div class="ui__score">{{ score }}</div>
    <div class="ui__colors">
      <app-ball class="ui__ball" *ngFor="let ball of balls" [data]="ball"></app-ball>
    </div>
    <div class="ui__turn">{{ turn }}</div>
  `,
  styleUrls: ['./ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiComponent implements OnDestroy {

  private _data: IUIData;
  private _timerSubscription: Subscription;

  public balls: IBall[] = [];
  public score = 0;
  public turn = 0;

  @Input() public set data(value: IUIData) {
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
      this._timerSubscription = timer(0, 20)
        .pipe(takeWhile(val => val < (value.score - currentScore)))
        .subscribe(() => {
          this.score++;
          this._changeDetectorRef.markForCheck();
        });
    }
    this.turn = value.turn;
  }

  public get data(): IUIData {
    return this._data;
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    if (this._timerSubscription) {
      this._timerSubscription.unsubscribe();
    }
  }

}
