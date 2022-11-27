import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TansactionCompleteComponent } from './tansaction-complete.component';

describe('TansactionCompleteComponent', () => {
  let component: TansactionCompleteComponent;
  let fixture: ComponentFixture<TansactionCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TansactionCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TansactionCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
