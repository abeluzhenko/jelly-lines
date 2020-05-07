import { $$ } from 'protractor';

export class Animation {
  getBalls() {
    return $$('app-grid-animation app-ball');
  }
}
