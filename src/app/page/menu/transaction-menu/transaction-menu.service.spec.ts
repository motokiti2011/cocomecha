import { TestBed } from '@angular/core/testing';

import { TransactionMenuService } from './transaction-menu.service';

describe('TransactionMenuService', () => {
  let service: TransactionMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
