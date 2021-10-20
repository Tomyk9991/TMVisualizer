import { TestBed } from '@angular/core/testing';

import { StateEditorService } from './state-editor.service';

describe('StateeditorService', () => {
  let service: StateEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
