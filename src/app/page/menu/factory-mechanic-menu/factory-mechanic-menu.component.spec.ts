import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryMechanicMenuComponent } from './factory-mechanic-menu.component';

describe('FactoryMechanicMenuComponent', () => {
  let component: FactoryMechanicMenuComponent;
  let fixture: ComponentFixture<FactoryMechanicMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoryMechanicMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryMechanicMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
