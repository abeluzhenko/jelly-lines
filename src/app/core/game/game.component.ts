import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { GridService } from '../grid.service';
import { ITurnData } from 'src/app/core/shared/TurnData';
import { IGridAnimation } from 'src/app/core/shared/GridAnimation';
import { map } from 'rxjs/operators';
import { StartGameAction } from '../shared/Action';
import { IUIData } from '../shared/UIData';

@Component({
  selector: 'app-game',
  template: `
    <app-ui [data]="ui$ | async"></app-ui>
    <app-grid
      [turn]="turn$ | async"
      [animation]="animation$ | async"></app-grid>
  `,
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {

  turn$: Observable<ITurnData>;
  ui$: Observable<IUIData>;
  animation$: Observable<IGridAnimation[]>;

  constructor(
    private _grid: GridService
  ) {
  }

  ngOnInit() {
    this.turn$ = this._grid.state$.pipe(map((state) => state.turn));
    this.animation$ = this._grid.state$.pipe(map((state) => state.animation));
    this.ui$ = this._grid.state$.pipe(map((state) => state.ui));
    this._grid.dispatch(new StartGameAction());
  }
}
