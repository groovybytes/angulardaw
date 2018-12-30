import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporttestComponent } from './transporttest.component';

describe('TransporttestComponent', () => {
  let component: TransporttestComponent;
  let fixture: ComponentFixture<TransporttestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransporttestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporttestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
