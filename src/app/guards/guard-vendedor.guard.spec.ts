import { TestBed } from '@angular/core/testing';

import { GuardVendedorGuard } from './guard-vendedor.guard';

describe('GuardVendedorGuard', () => {
  let guard: GuardVendedorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardVendedorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
