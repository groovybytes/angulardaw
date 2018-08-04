import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressButtonComponent } from './press-button.component';

describe('PressButtonComponent', () => {
  let component: PressButtonComponent;
  let fixture: ComponentFixture<PressButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
