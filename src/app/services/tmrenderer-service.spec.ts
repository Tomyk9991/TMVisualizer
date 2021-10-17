import { TestBed } from '@angular/core/testing';

import { TMRendererService } from './t-m-renderer.service';

describe('TMRendererService', () => {
  let service: TMRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TMRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
