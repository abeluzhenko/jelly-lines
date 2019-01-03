import { TestBed, inject } from '@angular/core/testing';

import { GridFactoryService } from './grid-factory.service';

describe('GridFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridFactoryService]
    });
  });

  it('should be created', inject([GridFactoryService], (service: GridFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
