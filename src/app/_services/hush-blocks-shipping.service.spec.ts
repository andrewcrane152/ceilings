import { TestBed, inject } from '@angular/core/testing';

import { HushBlocksShippingService } from './hush-blocks-shipping.service';

describe('HushBlocksShippingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HushBlocksShippingService]
    });
  });

  it('should be created', inject([HushBlocksShippingService], (service: HushBlocksShippingService) => {
    expect(service).toBeTruthy();
  }));
});
