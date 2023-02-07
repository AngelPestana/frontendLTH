import { TestBed } from '@angular/core/testing';

import { GuardAccessGuard } from './guard-access.guard';

describe('GuardAccessGuard', () => {
  let guard: GuardAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
