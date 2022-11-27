import { TestBed } from '@angular/core/testing';

import { ServiceListcomponentService } from './service-listcomponent.service';

describe('ServiceListcomponentService', () => {
  let service: ServiceListcomponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceListcomponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
