import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionEntryComponent } from './transition-entry.component';

describe('StateComponent', () => {
  let component: TransitionEntryComponent;
  let fixture: ComponentFixture<TransitionEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitionEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
