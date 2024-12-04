import fs from 'node:fs/promises';
import path from 'node:path';
import plugin from '../src';

function isSourceFile(value: string): boolean {
  const ext = path.extname(value);
  return ext === '.ts' && !value.endsWith('.d.ts');
}

describe('package', () => {
  const pkg = path.resolve('src');

  it('exists', () => {
    expect(plugin).toBeDefined();
  });

  it('has every rule', async () => {
    const files = await fs.readdir(path.resolve(pkg, 'rules'));
    for (const file of files.filter(isSourceFile)) {
      const ruleName = path.basename(file, path.extname(file));
      expect(plugin.rules).toHaveProperty(ruleName);
    }
  });

  it('exports all configs', async () => {
    const files = await fs.readdir(path.resolve(pkg, 'configs'));
    for (const file of files.filter(isSourceFile)) {
      const configName = path.basename(file, path.extname(file));
      expect(plugin.configs).toHaveProperty(configName);
    }
  });

  it('has configs only for rules included in the plugin', () => {
    if (!plugin.configs) {
      expect.fail('No configs found.');
    }

    const namespace = 'rxjs-x';
    for (const config of Object.values(plugin.configs)) {
      if (!config.rules) {
        continue;
      }
      for (const ruleName of Object.keys(config.rules)) {
        expect(plugin.rules).toHaveProperty(ruleName.slice(namespace.length + 1));
      }
    }
  });

  it.for(Object.keys(plugin.rules))('includes rule %s in configurations based on meta.docs.recommended', (ruleName, { expect }) => {
    const rule = plugin.rules[ruleName as keyof typeof plugin.rules];
    const namespace = 'rxjs-x';
    const fullRuleName = `${namespace}/${ruleName}`;

    if (!rule.meta.docs?.recommended) {
      // Rule is not included in any configuration.
      expect(plugin.configs.recommended.rules).not.toHaveProperty(fullRuleName);
      expect(plugin.configs.strict.rules).not.toHaveProperty(fullRuleName);
    } else if (typeof rule.meta.docs.recommended === 'string') {
      // Rule specifies only a configuration name.
      expect(rule.meta.docs.recommended).toMatch(/^(recommended|strict)$/);
      if (rule.meta.docs.recommended === 'recommended') {
        expect(plugin.configs.recommended.rules).toHaveProperty(fullRuleName);
      } else {
        expect(plugin.configs.recommended.rules).not.toHaveProperty(fullRuleName);
      }

      // Strict configuration always includes all recommended rules.
      // Not allowed to specify non-default options since rule only specifies a configuration name.
      expect(plugin.configs.strict.rules).toHaveProperty(fullRuleName, expect.any(String));
    } else {
      // Rule specifies non-default options for strict.
      if (rule.meta.docs.recommended.recommended) {
        expect(plugin.configs.recommended.rules).toHaveProperty(fullRuleName);
      } else {
        expect(plugin.configs.recommended.rules).not.toHaveProperty(fullRuleName);
      }
      expect(plugin.configs.strict.rules).toHaveProperty(fullRuleName, [expect.any(String), rule.meta.docs.recommended.strict[0]]);
    }
  });
});
