import { AngularDesktopModule } from './angular-desktop.module';

describe('AngularDesktopModule', () => {
  let angularDesktopModule: AngularDesktopModule;

  beforeEach(() => {
    angularDesktopModule = new AngularDesktopModule();
  });

  it('should create an instance', () => {
    expect(angularDesktopModule).toBeTruthy();
  });
});
