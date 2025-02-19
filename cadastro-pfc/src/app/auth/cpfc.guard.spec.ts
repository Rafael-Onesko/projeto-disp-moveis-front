import { TestBed } from '@angular/core/testing';

import { CpfcGuard } from './cpfc.guard';

describe('CpfcGuard', () => {
  let guard: CpfcGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CpfcGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
