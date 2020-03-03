import { Injectable } from '@angular/core';
import { GameState, INITIAL_STATE, cloneDeep } from './shared';

@Injectable({
  providedIn: 'root'
})
export class GridFactoryService {
  get initialState(): GameState {
    return cloneDeep(INITIAL_STATE);
  }
}
