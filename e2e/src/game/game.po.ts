import { $$, By, ElementFinder } from 'protractor';

export class Game {
  getCells() {
    return $$('app-grid app-cell');
  }

  getBalls() {
    return $$('app-grid app-cell app-ball');
  }

  getBall(cell: ElementFinder) {
    return cell.$('app-ball');
  }

  getBallByNumber(id: number) {
    return this.getBalls().get(id);
  }

  getCellByNumber(id: number) {
    return this.getCells().get(id);
  }

  getEmptyCells() {
    return $$('app-grid app-cell:empty');
  }

  getFullCells() {
    return $$('app-grid app-cell:not(:empty)');
  }
}
