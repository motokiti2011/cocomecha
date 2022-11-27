import { TestBed } from '@angular/core/testing';

import { QuestionBoardService } from './question-board.service';

describe('QuestionBoardService', () => {
  let service: QuestionBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
