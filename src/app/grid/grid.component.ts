import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AnimationBuilder, keyframes, animate, AnimationStyleMetadata, style } from '@angular/animations';
import { GridService, ITurnData, IGridAnimation, GridAnimationType } from '../grid.service';
import { ICell } from '../cell/cell.model';
import { Grid } from '../grid.model';
import { BallComponent } from '../ball/ball.component';
import { IBall, BallColor } from '../ball/ball.model';
import { cellBallAnimation, MOVING_DURATION } from './grid.animations';

@Component({
  selector: 'app-grid',
  template: `
    <app-ui [data]="data"></app-ui>
    <app-cell
      *ngFor="let cell of data.cells"
      [data]="cell"
      (clicked)="cellClicked($event)"
      (ballClicked)="ballClicked($event)">
      <app-ball
        *ngIf="cell.ball"
        [@cellBallAnimation]="animatedData === cell.ball ? 'animated' : 'active'"
        [data]="cell.ball"></app-ball>
    </app-cell>
    <app-ball
      class="animation"
      #animatedBall
      [style.visibility]="animatedData ? 'visible' : 'hidden'"
      [data]="animatedData"></app-ball>
  `,
  styleUrls: ['./grid.component.scss'],
  animations: [ cellBallAnimation ]
})
export class GridComponent implements OnInit {

  private _data: ITurnData;

  public set data(value: ITurnData) {
    this._data = Object.assign({}, this._data, value);
  }
  public get data(): ITurnData {
    return this._data;
  }

  @ViewChild('animatedBall') animatedBall: BallComponent;
  public animatedData: IBall;

  constructor(
    private _gridService: GridService,
    private _animationBuilder: AnimationBuilder
  ) {
    this._gridService.output$.subscribe(data => this.data = data);
    this._gridService.animation$.subscribe(data => this.processAnimation(data));
    this.turn(Grid.getGrid());
  }

  ngOnInit() {
  }

  cellClicked(cell: ICell) {
    this._gridService.input$.next({ cells: this.data.cells, cell });
  }

  private turn(cells: ICell[], nextColors?: BallColor[]) {
    this._gridService.input$.next({ cells, nextColors });
  }

  private processAnimation(data: IGridAnimation) {
    if (data.type === GridAnimationType.Move) {
      const ballData = data.cells[data.cells.length - 1].ball;
      const animation = this.buildMoveAnimation(data.cells);
      const player = animation.create(this.animatedBall.elementRef.nativeElement);
      this.animatedData = ballData;
      player.onDone(() => {
        this.animatedData = null;
        this.turn(this.data.cells, this.data.nextColors);
      });
      player.play();
    }
  }

  private buildMoveAnimation(data: ICell[], duration = MOVING_DURATION) {
    const delta = duration / data.length;
    const steps: AnimationStyleMetadata[] = data
      .map((cell, i) => {
        const position = Grid.getPosition(cell.id);
        return style({
          transform: `translate(${ position.x * 100 }%, ${ position.y * 100 }%)`,
          offset: delta * i / 1000
        });
      });
    return this._animationBuilder.build([
      animate(`${ duration }ms ease`, keyframes(steps))
    ]);
  }

}
