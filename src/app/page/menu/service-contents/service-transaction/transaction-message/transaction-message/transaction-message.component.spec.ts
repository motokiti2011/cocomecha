import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMessageComponent } from './transaction-message.component';

describe('TransactionMessageComponent', () => {
  let component: TransactionMessageComponent;
  let fixture: ComponentFixture<TransactionMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
