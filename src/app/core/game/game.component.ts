import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { GridService } from '../grid.service';
import { Grid } from '../shared/Grid';
import { ITurnData } from 'src/app/core/shared/TurnData';
import { IGridAnimation } from 'src/app/core/shared/GridAnimation';
import { pluck, distinctUntilChanged } from 'rxjs/operators';
import { SelectCellAction } from '../shared/Action';

@Component({
  selector: 'app-game',
  template: `
    <app-ui [data]="output$ | async"></app-ui>
    <app-grid
      [data]="output$ | async"
      [animation]="animation$ | async"
      (input)="onInput($event)"></app-grid>
  `,
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {

  turn$: Observable<ITurnData>;
  animation$: Observable<IGridAnimation>;

  constructor(
    private _grid: GridService
  ) {}

  ngOnInit() {
    this.turn$ = this._grid.state$.pipe(pluck('turn'));
    this.animation$ = this._grid.state$.pipe(pluck('animation'));
  }

  onInput(data: ITurnData) {
    this.next(data);
  }

  private next(data: ITurnData) {
    this._grid.dispatch(new SelectCellAction(data.cell));
  }

}
