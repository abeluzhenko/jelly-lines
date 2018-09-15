import { Injectable } from '@angular/core';
import { Grid } from './grid/grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private _data: Grid;

  constructor() {
    this._data = new Grid();
  }

  public get data(): Grid {
    return this._data;
  }
}
