import { TestBed } from '@angular/core/testing';

import { ServiceSerchConditionsService } from './service-serch-conditions.service';

describe('ServiceSerchConditionsService', () => {
  let service: ServiceSerchConditionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceSerchConditionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
