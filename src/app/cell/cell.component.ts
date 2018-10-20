import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ICell } from './cell.model';

@Component({
  selector: 'app-cell',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @Input() data: ICell;
  @Output() clicked: EventEmitter<ICell> = new EventEmitter<ICell>();

  @HostListener('click')
  onClick() {
    this.clicked.emit(this.data);
  }
}
