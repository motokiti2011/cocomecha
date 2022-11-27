import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTransactionComponent } from './service-transaction.component';

describe('ServiceTransactionComponent', () => {
  let component: ServiceTransactionComponent;
  let fixture: ComponentFixture<ServiceTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
