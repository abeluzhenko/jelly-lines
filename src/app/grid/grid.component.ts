import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, ViewChild } from '@angular/core';
import { AnimationBuilder, keyframes, animate, AnimationStyleMetadata, style } from '@angular/animations';
import { GridService } from '../grid.service';
import { ICell } from '../cell/cell.model';
import { Grid, IGridAnimation, GridAnimationType } from '../grid.model';
import { BallComponent } from '../ball/ball.component';
import { IBall } from '../ball/ball.model';

@Component({
  selector: 'app-grid',
  template: `
    <app-cell
      *ngFor="let cell of cells"
      [data]="cell"
      (clicked)="cellClicked($event)"
      (ballClicked)="ballClicked($event)">
    </app-cell>
    <app-ball
      class="animation"
      #animatedBall
      [data]="animatedData"></app-ball>
  `,
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewInit {

  public cells: ICell[];

  @ViewChild('animatedBall') animatedBall: any;
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

  ngAfterViewInit() {
  }

  cellClicked(cell: ICell) {
    this._gridService.input$.next({ cells: this.cells, cell });
  }

  private processAnimation(data: IGridAnimation) {
    if (data.type === GridAnimationType.Move) {
      const path = data.cells;
      const last = path[path.length - 1];
      const animation = this.buildMoveAnimation(data.cells);
      console.log(this.animatedBall, animation);
      // const player = animation.create(element.elementRef.nativeElement);
      // player.play();
    }
  }

  private buildMoveAnimation(data: ICell[]) {
    const from = Grid.getPosition(data[0].id);
    const delta = 1 / data.length;
    const steps: AnimationStyleMetadata[] = data.map((cell, i) => {
      const to = Grid.getPosition(cell.id);
      return style({
        transform: `translate(${ (to.x - from.x) * 100 }%, ${ (to.y - from.y) * 100 }%)`,
        offset: delta * i
      });
    });
    return this._animationBuilder.build([
      animate('1s', keyframes(steps))
    ]);
  }

}
