import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListSideMenuComponent } from './service-list-side-menu.component';

describe('ServiceListSideMenuComponent', () => {
  let component: ServiceListSideMenuComponent;
  let fixture: ComponentFixture<ServiceListSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceListSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceListSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
