import { TestBed } from '@angular/core/testing';

import { OpenAiIntegrationService } from './open-ai-integration.service';

describe('OpenAiIntegrationService', () => {
  let service: OpenAiIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAiIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
