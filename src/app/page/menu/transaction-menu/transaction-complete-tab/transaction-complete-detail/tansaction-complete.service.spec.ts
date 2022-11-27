import { TestBed } from '@angular/core/testing';

import { TansactionCompleteService } from './tansaction-complete.service';

describe('TansactionCompleteService', () => {
  let service: TansactionCompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TansactionCompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
