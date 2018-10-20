import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AnimationBuilder, keyframes, animate, AnimationStyleMetadata, style } from '@angular/animations';
import { GridService } from '../grid.service';
import { ICell } from '../cell/cell.model';
import { Grid, IGridAnimation, GridAnimationType } from '../grid.model';
import { BallComponent } from '../ball/ball.component';
import { IBall } from '../ball/ball.model';
import { cellBallAnimation } from './grid.animations';

@Component({
  selector: 'app-grid',
  template: `
    <app-cell
      *ngFor="let cell of cells"
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
      [data]="animatedData"></app-ball>
  `,
  styleUrls: ['./grid.component.scss'],
  animations: [ cellBallAnimation ]
})
export class GridComponent implements OnInit {

  public cells: ICell[];

  @ViewChild('animatedBall') animatedBall: BallComponent;
  public animatedData: IBall;

  constructor(
    private _gridService: GridService,
    private _animationBuilder: AnimationBuilder
  ) {
    this._gridService.output$.subscribe(cells => this.cells = cells);
    this._gridService.input$.next({ cells: Grid.getGrid() });
    this._gridService.animation$.subscribe(data => this.processAnimation(data));
  }

  ngOnInit() {
  }

  cellClicked(cell: ICell) {
    this._gridService.input$.next({ cells: this.cells, cell });
  }

  private processAnimation(data: IGridAnimation) {
    if (data.type === GridAnimationType.Move) {
      const ballData = data.cells[data.cells.length - 1].ball;
      const animation = this.buildMoveAnimation(data.cells);
      const player = animation.create(this.animatedBall.elementRef.nativeElement);
      player.play();
      this.animatedData = ballData;
    }
  }

  private buildMoveAnimation(data: ICell[], duration = 1) {
    const delta = duration / data.length;
    const steps: AnimationStyleMetadata[] = data
      .map((cell, i) => {
        const position = Grid.getPosition(cell.id);
        return style({
          transform: `translate(${ position.x * 100 }%, ${ position.y * 100 }%)`,
          offset: delta * i
        });
      });
    return this._animationBuilder.build([
      animate('1s ease', keyframes(steps))
    ]);
  }

}
