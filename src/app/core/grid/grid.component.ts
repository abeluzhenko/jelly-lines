import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { cellBallAnimation } from './grid.animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ITurnData } from 'src/app/core/shared/TurnData';
import { Grid } from 'src/app/core/shared/Grid';
import { IGridAnimation } from 'src/app/core/shared/GridAnimation';
import { ICell } from 'src/app/core/shared/Cell';

@Component({
  selector: 'app-grid',
  template: `
    <app-cell
      *ngFor="let cell of data?.cells"
      [data]="cell"
      [style.transform]="styles[cell.id]"
      (clicked)="cellClicked($event)"
      (ballClicked)="ballClicked($event)">
      <app-ball
        *ngIf="cell.ball"
        [@cellBallAnimation]="'active'"
        [data]="cell.ball"></app-ball>
    </app-cell>
    <app-grid-animation
      [container]="elementRef"
      [animation]="animation"
      (complete)="animationCompleted()"></app-grid-animation>
  `,
  styleUrls: ['./grid.component.scss'],
  animations: [ cellBallAnimation ]
})
export class GridComponent implements OnInit {

  public styles: SafeStyle[];
  public turnData: ITurnData;

  @Input() public set data(value: ITurnData) {
    if (!value || !value.cells) {
      return;
    }
    this.styles = value.cells
      .map(cell => Grid.getPosition(cell.id))
      .map(pos => this._domSanitizer.bypassSecurityTrustStyle(
        'translate3d(' + (pos.x * 100) + '%, ' + (pos.y * 100) + '%, 1px)'));
    this.turnData = value;
  }

  public get data(): ITurnData {
    return this.turnData;
  }

  @Input() public animation: IGridAnimation;

  @Output() input: EventEmitter<ITurnData> = new EventEmitter<ITurnData>();

  constructor(
    public elementRef: ElementRef,
    private _domSanitizer: DomSanitizer
  ) {}

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
