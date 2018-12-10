import { UiCoreModule } from './ui-core.module';

describe('UiCoreModule', () => {
  let uiCoreModule: UiCoreModule;

  beforeEach(() => {
    uiCoreModule = new UiCoreModule();
  });

  it('should create an instance', () => {
    expect(uiCoreModule).toBeTruthy();
  });
});
