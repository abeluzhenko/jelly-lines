import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Cell } from '../../shared';

@Component({
  selector: 'app-cell',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @Input() cell: Cell;
  @Output() clicked: EventEmitter<Cell> = new EventEmitter<Cell>();

  @HostListener('click')
  onClick() {
    this.clicked.emit(this.cell);
  }
}
