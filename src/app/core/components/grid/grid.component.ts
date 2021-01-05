import { Component, Input, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { GridService } from '../../services/grid.service';
import { POSITION_PERCENTAGE } from '../grid-animation/grid-animation.animations';
import { GridAnimation, Cell, TurnData, SelectCellAction, StartGameAction } from '../../shared';
import * as Grid from 'src/app/core/shared/grid';

@Component({
  selector: 'app-grid',
  template: `
    <app-grid-animation [container]="elementRef"
                        [animation]="animation"
                        (completed)="animationCompleted()"></app-grid-animation>
    <app-cell *ngFor="let cell of turn?.cells; index as i"
              [attr.id]="'grid-cell-' + i"
              [cell]="cell"
              [style.transform]="styles[cell.id]"
              (clicked)="cellClicked($event)">
      <app-ball *ngIf="cell.ball"
                [attr.id]="'grid-ball-' + i"
                [style.visibility]="getBallVisibility(cell.id) ? 'visible' : 'hidden'"
                [ball]="cell.ball"></app-ball>
    </app-cell>
  `,
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  private _animation: GridAnimation[];
  private isInAnimation = false;
  private animatedCells: Cell[] = [];

  public styles: SafeStyle[];
  public turnData: TurnData;

  @Input() public set turn(value: TurnData) {
    // TODO: use renderer2
    this.styles = value.cells
      .map((cell) => Grid.getPosition(cell.id))
      .map((position) => this.domSanitizer.bypassSecurityTrustStyle(
        `translate3d(${ position.x * POSITION_PERCENTAGE }%, ${ position.y * POSITION_PERCENTAGE }%, 1px)`));
    this.turnData = value;
  }
  public get turn(): TurnData {
    return this.turnData;
  }

  @Input() public set animation(value: GridAnimation[]) {
    this._animation = value;
    if (value && value.length) {
      this.isInAnimation = true;
      this.animatedCells = value.reduce((result, el) =>
        el.cells ? [...result, ...el.cells] : result, []);
    }
  }
  public get animation(): GridAnimation[] {
    return this._animation;
  }

  constructor(
    public elementRef: ElementRef,
    private domSanitizer: DomSanitizer,
    private grid: GridService,
  ) {}

  getBallVisibility(id: number): boolean {
    if (!this.isInAnimation) {
      return true;
    }

    return !this.animatedCells.some((cell) => cell.id === id);
  }

  cellClicked(cell: Cell) {
    if (!this.isInAnimation) {
      this.grid.dispatch(new SelectCellAction(cell));
    }
  }

  animationCompleted() {
    this.isInAnimation = false;
    this.animatedCells = [];
    this.grid.dispatch(new StartGameAction());
  }
}
