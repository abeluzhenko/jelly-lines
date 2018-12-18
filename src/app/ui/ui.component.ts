import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IUIData } from './ui.model';
import { IBall, BallState } from '../shared/ball.model';
import { timer, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-ui',
  template: `
    <div class="ui__score">{{ score }}</div>
    <div class="ui__colors">
      <app-ball class="ui__ball" *ngFor="let ball of balls" [data]="ball"></app-ball>
    </div>
    <div class="ui__turn">{{ turn }}</div>
  `,
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit, OnDestroy {

  private _data: IUIData;
  private _timerSubscription: Subscription;

  public balls: IBall[] = [];
  public score = 0;
  public turn = 0;

  @Input() set data(value: IUIData) {
    if (!value) {
      return;
    }
    if (value.nextColors) {
      this.balls = value.nextColors.map((color, i) =>
        ({ id: i, color, state: BallState.idle }));
    }
    this._data = value;
    if (value.score !== this.score) {
      this.turn++;

      const currentScore = this.score;
      this._timerSubscription = timer(0, 20)
        .pipe(takeWhile(val => val < (value.score - currentScore)))
        .subscribe(() => this.score++);
    }
  }

  get data(): IUIData {
    return this._data;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this._timerSubscription) {
      this._timerSubscription.unsubscribe();
    }
  }

}
