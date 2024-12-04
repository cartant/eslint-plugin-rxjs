import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

export function hasTypeAnnotation<T extends TSESTree.Node>(
  node: T,
): node is T & { typeAnnotation: TSESTree.TSTypeAnnotation } {
  return 'typeAnnotation' in node && !!node.typeAnnotation;
}

export function isArrayExpression(node: TSESTree.Node): node is TSESTree.ArrayExpression {
  return node.type === AST_NODE_TYPES.ArrayExpression;
}

export function isArrayPattern(node: TSESTree.Node): node is TSESTree.ArrayPattern {
  return node.type === AST_NODE_TYPES.ArrayPattern;
}

export function isArrowFunctionExpression(
  node: TSESTree.Node,
): node is TSESTree.ArrowFunctionExpression {
  return node.type === AST_NODE_TYPES.ArrowFunctionExpression;
}

export function isAssignmentExpression(
  node: TSESTree.Node,
): node is TSESTree.AssignmentExpression {
  return node.type === AST_NODE_TYPES.AssignmentExpression;
}

export function isBlockStatement(node: TSESTree.Node): node is TSESTree.BlockStatement {
  return node.type === AST_NODE_TYPES.BlockStatement;
}

export function isCallExpression(node: TSESTree.Node): node is TSESTree.CallExpression {
  return node.type === AST_NODE_TYPES.CallExpression;
}

export function isChainExpression(node: TSESTree.Node): node is TSESTree.ChainExpression {
  return node.type === AST_NODE_TYPES.ChainExpression;
}

export function isExportNamedDeclaration(
  node: TSESTree.Node,
): node is TSESTree.ExportNamedDeclaration {
  return node.type === AST_NODE_TYPES.ExportNamedDeclaration;
}

export function isExpressionStatement(
  node: TSESTree.Node,
): node is TSESTree.ExpressionStatement {
  return node && node.type === AST_NODE_TYPES.ExpressionStatement;
}

export function isFunctionDeclaration(
  node: TSESTree.Node,
): node is TSESTree.FunctionDeclaration {
  return node.type === AST_NODE_TYPES.FunctionDeclaration;
}

export function isFunctionExpression(
  node: TSESTree.Node,
): node is TSESTree.FunctionExpression {
  return node.type === AST_NODE_TYPES.FunctionExpression;
}

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === AST_NODE_TYPES.Identifier;
}

export function isImportDeclaration(node: TSESTree.Node): node is TSESTree.ImportDeclaration {
  return node.type === AST_NODE_TYPES.ImportDeclaration;
}

export function isImportNamespaceSpecifier(node: TSESTree.Node): node is TSESTree.ImportNamespaceSpecifier {
  return node.type === AST_NODE_TYPES.ImportNamespaceSpecifier;
}

export function isImportSpecifier(node: TSESTree.Node): node is TSESTree.ImportSpecifier {
  return node.type === AST_NODE_TYPES.ImportSpecifier;
}

export function isJSXExpressionContainer(node: TSESTree.Node): node is TSESTree.JSXExpressionContainer {
  return node.type === AST_NODE_TYPES.JSXExpressionContainer;
}

export function isLiteral(node: TSESTree.Node): node is TSESTree.Literal {
  return node.type === AST_NODE_TYPES.Literal;
}

export function isMemberExpression(node: TSESTree.Node): node is TSESTree.MemberExpression {
  return node.type === AST_NODE_TYPES.MemberExpression;
}

export function isMethodDefinition(node: TSESTree.Node): node is TSESTree.MethodDefinition {
  return node.type === AST_NODE_TYPES.MethodDefinition;
}

export function isNewExpression(node: TSESTree.Node): node is TSESTree.NewExpression {
  return node.type === AST_NODE_TYPES.NewExpression;
}

export function isObjectExpression(node: TSESTree.Node): node is TSESTree.ObjectExpression {
  return node.type === AST_NODE_TYPES.ObjectExpression;
}

export function isObjectPattern(node: TSESTree.Node): node is TSESTree.ObjectPattern {
  return node.type === AST_NODE_TYPES.ObjectPattern;
}

export function isProgram(node: TSESTree.Node): node is TSESTree.Program {
  return node.type === AST_NODE_TYPES.Program;
}

export function isProperty(node: TSESTree.Node): node is TSESTree.Property {
  return node.type === AST_NODE_TYPES.Property;
}

export function isPropertyDefinition(node: TSESTree.Node): node is TSESTree.PropertyDefinition {
  return node.type === AST_NODE_TYPES.PropertyDefinition;
}

export function isPrivateIdentifier(
  node: TSESTree.Node,
): node is TSESTree.PrivateIdentifier {
  return node.type === AST_NODE_TYPES.PrivateIdentifier;
}

export function isRestElement(node: TSESTree.Node): node is TSESTree.RestElement {
  return node.type === AST_NODE_TYPES.RestElement;
}

export function isThisExpression(node: TSESTree.Node): node is TSESTree.ThisExpression {
  return node.type === AST_NODE_TYPES.ThisExpression;
}

export function isTSTypeLiteral(node: TSESTree.Node): node is TSESTree.TSTypeLiteral {
  return node.type === AST_NODE_TYPES.TSTypeLiteral;
}

export function isTSTypeReference(node: TSESTree.Node): node is TSESTree.TSTypeReference {
  return node.type === AST_NODE_TYPES.TSTypeReference;
}

export function isUnaryExpression(node: TSESTree.Node): node is TSESTree.UnaryExpression {
  return node.type === AST_NODE_TYPES.UnaryExpression;
}

export function isVariableDeclarator(
  node: TSESTree.Node,
): node is TSESTree.VariableDeclarator {
  return node.type === AST_NODE_TYPES.VariableDeclarator;
}
