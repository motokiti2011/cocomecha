import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePrmReqComponent } from './message-prm-req.component';

describe('MessagePrmReqComponent', () => {
  let component: MessagePrmReqComponent;
  let fixture: ComponentFixture<MessagePrmReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagePrmReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePrmReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
