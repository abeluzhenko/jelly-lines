import { Component, OnInit, HostListener } from '@angular/core';
import { GridService } from '../grid.service';
import { Cell } from '../cell/cell.model';
import { Ball } from '../ball/ball.model';
import { Observable } from 'rxjs';

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

  public cells: Cell[];

  constructor(
    private _gridService: GridService
  ) {
    this._gridService.output$.subscribe(cells => this.cells = cells);
    this._gridService.input$.next({ cells: this._gridService.getGrid() });
  }

  ngOnInit() {
  }

  cellClicked(cell: Cell) {
    this._gridService.input$.next({ cells: this.cells, cell });
  }
}
