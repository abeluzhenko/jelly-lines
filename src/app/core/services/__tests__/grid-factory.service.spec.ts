import { TestBed, inject } from '@angular/core/testing';

import { GridFactoryService } from '../grid-factory.service';
import { getChangedStateMock } from '../grid.mock';
import { getInitialState } from '../../shared';

describe('GridFactoryService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [GridFactoryService]
    });
  });

  it('should be created', inject([GridFactoryService], (service: GridFactoryService) => {
    expect(service).toBeTruthy();
  }));

  it('should load initial state from localStorage if the data is valid',
    inject([GridFactoryService], (service: GridFactoryService) => {

    const initialState = getInitialState();
    const state = getChangedStateMock(initialState, initialState.turn.cells[0]);

    localStorage.setItem(GridFactoryService.STORAGE_ITEM_NAME, JSON.stringify(state));

    expect(service.initialState).toEqual(state);
  }));

  afterEach(() => {
    localStorage.clear();
  });
});
