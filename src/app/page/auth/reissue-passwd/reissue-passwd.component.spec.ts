import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissuePasswdComponent } from './reissue-passwd.component';

describe('ReissuePasswdComponent', () => {
  let component: ReissuePasswdComponent;
  let fixture: ComponentFixture<ReissuePasswdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReissuePasswdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReissuePasswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
