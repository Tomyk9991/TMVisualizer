import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAlphabetDialogComponent } from './change-alphabet-dialog.component';

describe('ChangeAlphabetDialogComponent', () => {
  let component: ChangeAlphabetDialogComponent;
  let fixture: ComponentFixture<ChangeAlphabetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAlphabetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAlphabetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
