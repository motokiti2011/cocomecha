import { TestBed } from '@angular/core/testing';

import { TransactionMessageService } from './transaction-message.service';

describe('TransactionMessageService', () => {
  let service: TransactionMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
