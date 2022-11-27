import { TestBed } from '@angular/core/testing';

import { BrowsingHistoryService } from './browsing-history.service';

describe('BrowsingHistoryService', () => {
  let service: BrowsingHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowsingHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
