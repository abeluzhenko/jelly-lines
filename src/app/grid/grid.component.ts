import { Component, OnInit } from '@angular/core';
import { GridService } from '../grid.service';
import { ICell } from '../cell/cell.model';
import { Grid, IGridAnimation } from '../grid.model';
import { AnimationBuilder, keyframes, animate, AnimationStyleMetadata, style } from '@angular/animations';

@Component({
  selector: 'app-grid',
  template: `
    <app-cell
      *ngFor="let cell of cells"
      [data]="cell"
      (clicked)="cellClicked($event)"
      (ballClicked)="ballClicked($event)">
    </app-cell>
  `,
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public cells: ICell[];

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
    console.log(data);
  }

  private buildMoveAnimation(data: ICell[]) {
    const from = Grid.getPosition(data[0].id);
    const delta = 1 / data.length;
    const steps: AnimationStyleMetadata[] = data.map((cell, i) => {
      const to = Grid.getPosition(cell.id);
      return style({
        transform: `translate(${ (from.x - to.x) * 100 }%, ${ (from.y - to.y) * 100 }%)`,
        offset: delta * i
      });
    });
    return this._animationBuilder.build([
      animate('1s', keyframes(steps))
    ]);
  }

}
