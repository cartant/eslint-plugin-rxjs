import { DefinitionType } from '@typescript-eslint/scope-manager';
import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';

export function isImport(
  scope: TSESLint.Scope.Scope,
  name: string,
  source: string | RegExp,
): boolean {
  const variable = scope.variables.find((variable) => variable.name === name);
  if (variable) {
    return variable.defs.some(
      (def) =>
        def.type === DefinitionType.ImportBinding
        && def.parent.type === AST_NODE_TYPES.ImportDeclaration
        && (typeof source === 'string'
          ? def.parent.source.value === source
          : source.test(def.parent.source.value)),
    );
  }
  return scope.upper ? isImport(scope.upper, name, source) : false;
}
