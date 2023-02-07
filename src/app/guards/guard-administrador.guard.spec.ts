import { TestBed } from '@angular/core/testing';

import { GuardAdministradorGuard } from './guard-administrador.guard';

describe('GuardAdministradorGuard', () => {
  let guard: GuardAdministradorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardAdministradorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
