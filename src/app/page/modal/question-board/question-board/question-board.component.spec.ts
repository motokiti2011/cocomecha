import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBoardComponent } from './question-board.component';

describe('QuestionBoardComponent', () => {
  let component: QuestionBoardComponent;
  let fixture: ComponentFixture<QuestionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
