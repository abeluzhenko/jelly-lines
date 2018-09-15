import { Component, OnInit } from '@angular/core';
import { Grid } from './grid.model';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public GRID_SIZE = 5;
  public grid: Grid;

  constructor(
    private _gridService: GridService
  ) {
    this.grid = this._gridService.data;
  }

  ngOnInit() {
  }

}
