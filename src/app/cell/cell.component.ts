import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { IBall } from '../ball/ball.model';
import { ICell } from './cell.model';
import { cellBallAnimation } from './cell.animations';

@Component({
  selector: 'app-cell',
  template: `
  <app-ball
    *ngIf="data?.ball"
    [@cellBallAnimation]="'visible'"
    [data]="data?.ball"></app-ball>
  `,
  styleUrls: ['./cell.component.scss'],
  animations: [ cellBallAnimation ]
})
export class CellComponent implements OnInit {

  @Input() data: ICell;
  @Output() clicked: EventEmitter<ICell> = new EventEmitter<ICell>();
  @Output() ballClicked: EventEmitter<IBall> = new EventEmitter<IBall>();

  @HostListener('click')
  onClick() {
    this.clicked.emit(this.data);
  }

  constructor() { }

  ngOnInit() {
  }
}
