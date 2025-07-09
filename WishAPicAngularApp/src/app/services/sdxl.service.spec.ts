import { TestBed } from '@angular/core/testing';

import { SdxlService } from './sdxl.service';

describe('SdxlService', () => {
  let service: SdxlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SdxlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
