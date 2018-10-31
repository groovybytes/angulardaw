import { TestBed, inject } from '@angular/core/testing';

import { AngularDesktopService } from './angular-desktop.service';

describe('AngularDesktopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularDesktopService]
    });
  });

  it('should be created', inject([AngularDesktopService], (service: AngularDesktopService) => {
    expect(service).toBeTruthy();
  }));
});
