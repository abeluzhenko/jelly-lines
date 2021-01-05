import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { GridService } from '../../services/grid.service';
import { pluck } from 'rxjs/operators';
import { StartGameAction, UIData, TurnData, GridAnimation } from '../../shared';

@Component({
  selector: 'app-game',
  template: `
    <app-ui [data]="ui$ | async"></app-ui>
    <app-grid [turn]="turn$ | async"
              [animation]="animation$ | async"></app-grid>
  `,
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  turn$: Observable<TurnData>;
  ui$: Observable<UIData>;
  animation$: Observable<GridAnimation[]>;

  constructor(
    private grid: GridService
  ) {}

  ngOnInit() {
    this.turn$ = this.grid.state$.pipe(pluck('turn'));
    this.animation$ = this.grid.state$.pipe(pluck('animation'));
    this.ui$ = this.grid.state$.pipe(pluck('ui'));

    this.grid.dispatch(new StartGameAction());
  }
}
