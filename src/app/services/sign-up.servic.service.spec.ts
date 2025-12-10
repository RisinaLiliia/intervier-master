import { TestBed } from '@angular/core/testing';

import { SignUpServicService } from './sign-up.servic.service';

describe('SignUpServicService', () => {
  let service: SignUpServicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUpServicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
