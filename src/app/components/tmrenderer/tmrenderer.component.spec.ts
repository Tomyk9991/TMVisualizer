import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMRendererComponent } from './tmrenderer.component';

describe('TMRendererComponent', () => {
  let component: TMRendererComponent;
  let fixture: ComponentFixture<TMRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TMRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TMRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
