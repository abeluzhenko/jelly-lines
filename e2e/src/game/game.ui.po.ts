import { $ } from 'protractor';

export class UI {
  getScoreText() {
    return $('.ui__score').getText();
  }

  getTurnText() {
    return $('.ui__turn').getText();
  }
}
