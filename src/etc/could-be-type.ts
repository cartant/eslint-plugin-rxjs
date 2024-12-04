import * as tsutils from 'ts-api-utils';
import ts from 'typescript';

export function couldBeType(
  type: ts.Type,
  name: string | RegExp,
  qualified?: {
    name: RegExp;
    typeChecker: ts.TypeChecker;
  },
): boolean {
  if (tsutils.isTypeReference(type)) {
    type = type.target;
  }

  if (isType(type, name, qualified)) {
    return true;
  }

  if (tsutils.isUnionOrIntersectionType(type)) {
    return type.types.some(t => couldBeType(t, name, qualified));
  }

  const baseTypes = type.getBaseTypes();
  if (baseTypes?.some(t => couldBeType(t, name, qualified))) {
    return true;
  }

  if (couldImplement(type, name, qualified)) {
    return true;
  }

  return false;
}

function isType(
  type: ts.Type,
  name: string | RegExp,
  qualified?: {
    name: RegExp;
    typeChecker: ts.TypeChecker;
  },
): boolean {
  if (!type.symbol) {
    return false;
  }
  if (
    qualified
    && !qualified.name.test(
      qualified.typeChecker.getFullyQualifiedName(type.symbol),
    )
  ) {
    return false;
  }
  return typeof name === 'string'
    ? type.symbol.name === name
    : Boolean(type.symbol.name.match(name));
}

function couldImplement(
  type: ts.Type,
  name: string | RegExp,
  qualified?: {
    name: RegExp;
    typeChecker: ts.TypeChecker;
  },
): boolean {
  const { symbol } = type;
  if (symbol) {
    const { valueDeclaration } = symbol;
    if (valueDeclaration && ts.isClassDeclaration(valueDeclaration)) {
      const { heritageClauses } = valueDeclaration;
      if (heritageClauses) {
        const implemented = heritageClauses.some(
          ({ token, types }) =>
            token === ts.SyntaxKind.ImplementsKeyword
            && types.some(node => isMatchingNode(node, name, qualified)),
        );
        if (implemented) {
          return true;
        }
      }
    }
  }
  return false;
}

function isMatchingNode(
  node: ts.ExpressionWithTypeArguments,
  name: string | RegExp,
  qualified?: {
    name: RegExp;
    typeChecker: ts.TypeChecker;
  },
): boolean {
  const { expression } = node;
  if (qualified) {
    const type = qualified.typeChecker.getTypeAtLocation(expression);
    if (type) {
      const qualifiedName = qualified.typeChecker.getFullyQualifiedName(
        type.symbol,
      );
      if (!qualified.name.test(qualifiedName)) {
        return false;
      }
    }
  }
  const text = expression.getText();
  return typeof name === 'string' ? text === name : Boolean(text.match(name));
}
