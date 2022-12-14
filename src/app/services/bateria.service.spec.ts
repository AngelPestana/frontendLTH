import { TestBed } from '@angular/core/testing';

import { BateriaService } from './bateria.service';

describe('BateriaService', () => {
  let service: BateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BateriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
