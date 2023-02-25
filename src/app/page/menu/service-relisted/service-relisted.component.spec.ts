import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRelistedComponent } from './service-relisted.component';

describe('ServiceRelistedComponent', () => {
  let component: ServiceRelistedComponent;
  let fixture: ComponentFixture<ServiceRelistedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRelistedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRelistedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
