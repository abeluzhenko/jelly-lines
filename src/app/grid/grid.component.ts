import { Component, OnInit } from '@angular/core';
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
  public cells: Cell[][];

  constructor(
    private _gridService: GridService
  ) {
    this.cells = this._gridService.data;
  }

  ngOnInit() {
  }

  cellClicked(cell: Cell) {
  }

  ballClicked(ball: Ball) {
    this._gridService.setCurrentBall(ball);
  }

}
