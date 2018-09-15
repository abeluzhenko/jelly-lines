import { Component, OnInit, Input } from '@angular/core';
import { Ball } from '../ball/ball.model';
import { Cell } from './cell.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input() data: Cell;

  constructor() { }

  ngOnInit() {
  }

  ballClicked(ball: Ball) {
    console.log(ball);
  }
}
