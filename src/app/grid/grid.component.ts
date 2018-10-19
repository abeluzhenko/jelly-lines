import { Component, OnInit } from '@angular/core';
import { GridService, IGridAnimation } from '../grid.service';
import { ICell } from '../cell/cell.model';

@Component({
  selector: 'app-grid',
  template: `
    <app-cell
    *ngFor="let cell of cells"
    [data]="cell"
    (clicked)="cellClicked($event)"
    (ballClicked)="ballClicked($event)"></app-cell>
  `,
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public cells: ICell[];

  constructor(
    private _gridService: GridService
  ) {
    this._gridService.output$.subscribe(cells => this.cells = cells);
    this._gridService.input$.next({ cells: GridService.getGrid() });
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
}
