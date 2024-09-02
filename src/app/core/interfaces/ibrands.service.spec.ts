import { TestBed } from '@angular/core/testing';

import { IBrandsService } from './ibrands.service';

describe('IBrandsService', () => {
  let service: IBrandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IBrandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
