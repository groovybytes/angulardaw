import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplepianoComponent } from './simplepiano.component';

describe('SimplepianoComponent', () => {
  let component: SimplepianoComponent;
  let fixture: ComponentFixture<SimplepianoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplepianoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplepianoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
