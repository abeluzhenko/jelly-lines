import { Injectable } from '@angular/core';
import {GameState, getInitialState} from '../shared';

@Injectable({
  providedIn: 'root'
})
export class GridFactoryService {
  static STORAGE_ITEM_NAME = 'state';

  get initialState(): GameState {
    const storageData = localStorage.getItem(GridFactoryService.STORAGE_ITEM_NAME);

    if (storageData) {
      try {
        return JSON.parse(storageData);
      } catch (e) {
        console.warn(e);
      }
    }

    return getInitialState();
  }
}
