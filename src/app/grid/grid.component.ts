import { Component, OnInit, HostListener } from '@angular/core';
import { GridService } from '../grid.service';
import { Cell } from '../cell/cell.model';
import { Ball } from '../ball/ball.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public GRID_SIZE = 5;
  public cells: Cell[];

  constructor(
    private _gridService: GridService
  ) {
    this._gridService.output.subscribe(data => this.cells = data);
    this._gridService.input.next({ cells: this._gridService.getGrid() });
  }

  ngOnInit() {
  }

  cellClicked(cell: Cell) {
    this._gridService.input.next({ cells: this.cells, cell });
  }
}
