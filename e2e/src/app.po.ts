import { browser } from 'protractor';
import { GameState } from '../../src/app/core/shared';
import { GridFactoryService } from '../../src/app/core/grid-factory.service';

export class Application {
  navigateTo() {
    return browser.get('/');
  }

  async loadStateFromStorage(): Promise<GameState> {
    const stateData = await this.getFromStorage();

    return JSON.parse(stateData);
  }

  saveStateToStorage(state: GameState) {
    this.saveToStorage(JSON.stringify(state));
  }

  clearStorage() {
    return browser.executeScript(
      `return localStorage.clear();`
    );
  }

  private getFromStorage() {
    return browser.executeScript<string>(
      `return localStorage.getItem('${ GridFactoryService.STORAGE_ITEM_NAME }');`
    );
  }

  private saveToStorage(data: string) {
    return browser.executeScript(
      `return localStorage.setItem('${ GridFactoryService.STORAGE_ITEM_NAME }', '${ data }');`
    );
  }
}
