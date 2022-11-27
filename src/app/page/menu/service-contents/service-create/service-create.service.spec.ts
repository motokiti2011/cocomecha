import { TestBed } from '@angular/core/testing';

import { ServiceCreateService } from './service-create.service';

describe('ServiceCreateService', () => {
  let service: ServiceCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
