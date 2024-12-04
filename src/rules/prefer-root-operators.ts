import { TSESTree as es, TSESLint } from '@typescript-eslint/utils';
import { isIdentifier, isImportSpecifier, isLiteral } from '../etc';
import { ruleCreator } from '../utils';

// See https://rxjs.dev/guide/importing#how-to-migrate

const RENAMED_OPERATORS: Record<string, string> = {
  combineLatest: 'combineLatestWith',
  concat: 'concatWith',
  merge: 'mergeWith',
  onErrorResumeNext: 'onErrorResumeNextWith',
  race: 'raceWith',
  zip: 'zipWith',
};

const DEPRECATED_OPERATORS = [
  'partition',
];

export const preferRootOperatorsRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow importing operators from `rxjs/operators`.',
      recommended: 'recommended',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      forbidden: 'RxJS imports from `rxjs/operators` are forbidden; import from `rxjs` instead.',
      forbiddenWithoutFix: 'RxJS imports from `rxjs/operators` are forbidden; import from `rxjs` instead. Note some operators may have been renamed or deprecated.',
      suggest: 'Replace with import from `rxjs`.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'prefer-root-operators',
  create: (context) => {
    function getQuote(raw: string): string | undefined {
      const match = /^\s*('|")/.exec(raw);
      if (!match) {
        return undefined;
      }
      const [, quote] = match;
      return quote;
    }

    function getSourceReplacement(rawLocation: string): string | undefined {
      const quote = getQuote(rawLocation);
      if (!quote) {
        return undefined;
      }
      if (/^['"]rxjs\/operators/.test(rawLocation)) {
        return `${quote}rxjs${quote}`;
      }
      return undefined;
    }

    function hasDeprecatedOperators(specifiers?: es.ImportSpecifier[] | es.ExportSpecifier[]): boolean {
      return !!specifiers?.some(s => DEPRECATED_OPERATORS.includes(getName(getOperatorNode(s))));
    }

    function getName(node: es.Identifier | es.StringLiteral): string {
      return isIdentifier(node) ? node.name : node.value;
    }

    function getOperatorNode(node: es.ImportSpecifier | es.ExportSpecifier): es.Identifier | es.StringLiteral {
      return isImportSpecifier(node) ? node.imported : node.local;
    }

    function getAliasNode(node: es.ImportSpecifier | es.ExportSpecifier): es.Identifier | es.StringLiteral {
      return isImportSpecifier(node) ? node.local : node.exported;
    }

    function getOperatorReplacement(name: string): string | undefined {
      return RENAMED_OPERATORS[name];
    }

    function isNodesEqual(a: es.Node, b: es.Node): boolean {
      return a.range[0] === b.range[0] && a.range[1] === b.range[1];
    }

    function createFix(source: es.Node, replacement: string, specifiers: es.ImportSpecifier[] | es.ExportSpecifier[]) {
      return function* fix(fixer: TSESLint.RuleFixer) {
        // Rename the module name.
        yield fixer.replaceText(source, replacement);

        // Rename the imported operators if necessary.
        for (const specifier of specifiers) {
          const operatorNode = getOperatorNode(specifier);
          const operatorName = getName(operatorNode);

          const operatorReplacement = getOperatorReplacement(operatorName);
          if (!operatorReplacement) {
            // The operator has the same name.
            continue;
          }

          const aliasNode = getAliasNode(specifier);
          if (isNodesEqual(aliasNode, operatorNode)) {
            // concat -> concatWith as concat
            yield fixer.insertTextBefore(operatorNode, operatorReplacement + ' as ');
          } else if (isIdentifier(operatorNode)) {
            // concat as c -> concatWith as c
            yield fixer.replaceText(operatorNode, operatorReplacement);
          } else {
            // 'concat' as c -> 'concatWith' as c
            const quote = getQuote(operatorNode.raw);
            if (!quote) {
              continue;
            }
            yield fixer.replaceText(operatorNode, quote + operatorReplacement + quote);
          }
        }
      };
    }

    function reportNode(source: es.Literal, specifiers?: es.ImportSpecifier[] | es.ExportSpecifier[]): void {
      const replacement = getSourceReplacement(source.raw);
      if (!replacement || hasDeprecatedOperators(specifiers)) {
        context.report({
          messageId: 'forbiddenWithoutFix',
          node: source,
        });
        return;
      }

      if (!specifiers) {
        context.report({
          messageId: 'forbiddenWithoutFix',
          node: source,
          suggest: [{ messageId: 'suggest', fix: (fixer) => fixer.replaceText(source, replacement) }],
        });
        return;
      }

      const fix = createFix(source, replacement, specifiers);
      context.report({
        fix,
        messageId: 'forbidden',
        node: source,
        suggest: [{ messageId: 'suggest', fix }],
      });
    }

    return {
      'ImportDeclaration[source.value="rxjs/operators"]': (node: es.ImportDeclaration) => {
        // Exclude side effect imports, default imports, and namespace imports.
        const specifiers = node.specifiers.length && node.specifiers.every(importClause => isImportSpecifier(importClause))
          ? node.specifiers
          : undefined;

        reportNode(node.source, specifiers);
      },
      'ImportExpression[source.value="rxjs/operators"]': (node: es.ImportExpression) => {
        if (isLiteral(node.source)) {
          reportNode(node.source);
        }
      },
      'ExportNamedDeclaration[source.value="rxjs/operators"]': (node: es.ExportNamedDeclarationWithSource) => {
        reportNode(node.source, node.specifiers);
      },
      'ExportAllDeclaration[source.value="rxjs/operators"]': (node: es.ExportAllDeclaration) => {
        reportNode(node.source);
      },
    };
  },
});
