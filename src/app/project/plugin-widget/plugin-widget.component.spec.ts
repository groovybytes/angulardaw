import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginWidgetComponent } from './plugin-widget.component';

describe('PluginWidgetComponent', () => {
  let component: PluginWidgetComponent;
  let fixture: ComponentFixture<PluginWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
