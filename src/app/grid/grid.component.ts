import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITurnData, IGridAnimation } from '../grid.service';
import { ICell } from '../cell/cell.model';

@Component({
  selector: 'app-grid',
  template: `
    <app-cell
      *ngFor="let cell of data?.cells"
      [data]="cell"
      (clicked)="cellClicked($event)"
      (ballClicked)="ballClicked($event)">
      <app-ball
        *ngIf="cell.ball"
        [data]="cell.ball"></app-ball>
    </app-cell>
    <app-grid-animation
      [animation]="animation"
      (complete)="animationCompleted()"></app-grid-animation>
  `,
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() public data: ITurnData;

  @Input() public animation: IGridAnimation;

  @Output() input: EventEmitter<ITurnData> = new EventEmitter<ITurnData>();

  constructor() {}

  ngOnInit() {
  }

  cellClicked(cell: ICell) {
    this.next({
      cell,
      cells: this.data.cells,
      score: this.data.score,
      nextColors: this.data.nextColors
    });
  }

  animationCompleted() {
    this.next({
      cells: this.data.cells,
      score: this.data.score,
      nextColors: this.data.nextColors,
    });
  }

  private next(data: ITurnData) {
    this.input.emit(data);
  }
}
