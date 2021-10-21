import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StateEditorComponent} from './state-editor.component';

describe('StateEditorComponent', () => {
  let component: StateEditorComponent;
  let fixture: ComponentFixture<StateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
