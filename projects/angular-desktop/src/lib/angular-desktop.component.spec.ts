import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularDesktopComponent } from './angular-desktop.component';

describe('AngularDesktopComponent', () => {
  let component: AngularDesktopComponent;
  let fixture: ComponentFixture<AngularDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
