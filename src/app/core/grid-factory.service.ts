import { Injectable } from '@angular/core';
import { IGameState, GameState } from './shared/GameState';

@Injectable({
  providedIn: 'root'
})
export class GridFactoryService {

  constructor() { }

  public getInitialState(): IGameState {
    return new GameState();
  }
}
