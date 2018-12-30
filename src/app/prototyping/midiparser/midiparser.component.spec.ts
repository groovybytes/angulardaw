import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiparserComponent } from './midiparser.component';

describe('MidiparserComponent', () => {
  let component: MidiparserComponent;
  let fixture: ComponentFixture<MidiparserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidiparserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiparserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
