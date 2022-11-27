import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSerchConditionsComponent } from './service-serch-conditions.component';

describe('ServiceSerchConditionsComponent', () => {
  let component: ServiceSerchConditionsComponent;
  let fixture: ComponentFixture<ServiceSerchConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSerchConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSerchConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
