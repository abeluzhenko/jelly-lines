import { Component, OnInit, Input } from '@angular/core';
import { IUIData } from './ui.model';
import { IBall, BallState } from '../ball/ball.model';

@Component({
  selector: 'app-ui',
  template: `
    <div class="ui__colors">
      <app-ball class="ui__ball" *ngFor="let ball of balls" [data]="ball"></app-ball>
    </div>
    <div class="ui__score">{{ data?.score }}</div>
  `,
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {

  private _data: IUIData;
  public balls: IBall[] = [];

  @Input() set data(value: IUIData) {
    if (!value) {
      return;
    }
    if (value.nextColors) {
      this.balls = value.nextColors.map((color, i) =>
        ({ id: i, color, state: BallState.idle }));
    }
    this._data = value;
  }

  get data(): IUIData {
    return this._data;
  }

  constructor() { }

  ngOnInit() {
  }

}
