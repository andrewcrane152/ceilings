import { TestBed, inject } from '@angular/core/testing';

import { PricesService } from './prices.service';

describe('PricesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricesService]
    });
  });

  it('should be created', inject([PricesService], (service: PricesService) => {
    expect(service).toBeTruthy();
  }));
});
