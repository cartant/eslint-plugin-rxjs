import { createRecommendedConfig } from '../../src/configs/recommended';
import { createStrictConfig } from '../../src/configs/strict';

describe('strict', () => {
  const mockPlugin = {};
  const config = createStrictConfig(mockPlugin);

  it('should add the rxjs-x plugin', () => {
    expect(config.plugins).toEqual({ 'rxjs-x': mockPlugin });
  });

  it('should include the recommended rules', () => {
    const recommendedConfig = createRecommendedConfig(mockPlugin);

    for (const rule of Object.keys(recommendedConfig.rules)) {
      expect(config.rules).toHaveProperty(rule);
    }
  });

  it('should be named', () => {
    expect(config.name).toEqual('rxjs-x/strict');
  });
});
