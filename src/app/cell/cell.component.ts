import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Ball } from '../ball/ball.model';
import { Cell } from './cell.model';
import { cellBallAnimation } from './cell.animations';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  animations: [ cellBallAnimation ]
})
export class CellComponent implements OnInit {

  @Input() data: Cell;
  @Output() clicked: EventEmitter<Cell> = new EventEmitter<Cell>();
  @Output() ballClicked: EventEmitter<Ball> = new EventEmitter<Ball>();

  @HostListener('click')
  onClick() {
    this.clicked.emit(this.data);
  }

  constructor() { }

  ngOnInit() {
  }

  cellClick(cell: Cell) {
    this.clicked.emit(cell);
  }

  ballClick(ball: Ball) {
    this.ballClicked.emit(ball);
  }
}
