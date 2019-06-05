import { TestBed, inject } from '@angular/core/testing';

import { ClarioGridsService } from './clario-grids.service';

describe('ClarioGridsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClarioGridsService]
    });
  });

  it('should be created', inject([ClarioGridsService], (service: ClarioGridsService) => {
    expect(service).toBeTruthy();
  }));
});
