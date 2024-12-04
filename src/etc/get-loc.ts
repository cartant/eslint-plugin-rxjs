import { TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

export function getLoc(node: ts.Node): TSESTree.SourceLocation {
  const sourceFile = node.getSourceFile();
  const start = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
  const end = ts.getLineAndCharacterOfPosition(sourceFile, node.getEnd());
  return {
    start: {
      line: start.line + 1,
      column: start.character,
    },
    end: {
      line: end.line + 1,
      column: end.character,
    },
  };
}
