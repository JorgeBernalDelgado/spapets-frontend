import { TestBed } from '@angular/core/testing';

import { SpaApiService } from './spa-api.service';

describe('SpaApiService', () => {
  let service: SpaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
