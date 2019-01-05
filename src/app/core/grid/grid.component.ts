import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ITurnData } from 'src/app/core/shared/TurnData';
import { Grid } from 'src/app/core/shared/Grid';
import { IGridAnimation } from 'src/app/core/shared/GridAnimation';
import { ICell } from 'src/app/core/shared/Cell';
import { GridService } from '../grid.service';
import { SelectCellAction, StartGameAction } from '../shared/Action';

@Component({
  selector: 'app-grid',
  template: `
    <app-grid-animation
      [container]="elementRef"
      [animation]="animation"
      (completed)="animationCompleted()"></app-grid-animation>
    <app-cell
      *ngFor="let cell of turn?.cells"
      [data]="cell"
      [style.transform]="styles[cell.id]"
      (clicked)="cellClicked($event)">
      <app-ball
        *ngIf="cell.ball"
        [style.visibility]="getBallVisibility(cell.id) ? 'visible' : 'hidden'"
        [data]="cell.ball"></app-ball>
    </app-cell>
  `,
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  private _animation: IGridAnimation[];
  private _isInAnimation = false;
  private _animatedCells: ICell[] = [];

  public styles: SafeStyle[];
  public turnData: ITurnData;

  @Input() public set turn(value: ITurnData) {
    if (!value || !value.cells) {
      return;
    }
    this.styles = value.cells
      .map((cell) => Grid.getPosition(cell.id))
      .map((position) => this._domSanitizer.bypassSecurityTrustStyle(
        `translate3d(${position.x * 100}%, ${position.y * 100}%, 1px)`));
    this.turnData = value;
  }
  public get turn(): ITurnData {
    return this.turnData;
  }

  @Input() public set animation(value: IGridAnimation[]) {
    this._animation = value;
    if (value && value.length) {
      this._isInAnimation = true;
      this._animatedCells = value.reduce((result, el) =>
        el.cells ? [...result, ...el.cells] : result, []);
    }
  }
  public get animation(): IGridAnimation[] {
    return this._animation;
  }

  constructor(
    public elementRef: ElementRef,
    private _domSanitizer: DomSanitizer,
    private _grid: GridService,
  ) {}

  ngOnInit() {
  }

  getBallVisibility(id: number): boolean {
    if (!this._isInAnimation) {
      return true;
    }
    return !this._animatedCells.some((cell) => cell.id === id);
  }

  cellClicked(cell: ICell) {
    if (!this._isInAnimation) {
      this._grid.dispatch(new SelectCellAction(cell));
    }
  }

  animationCompleted() {
    this._isInAnimation = false;
    this._animatedCells = [];
    this._grid.dispatch(new StartGameAction());
  }
}
