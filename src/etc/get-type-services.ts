import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';
import { couldBeFunction } from './could-be-function';
import { couldBeType as tsutilsEtcCouldBeType } from './could-be-type';
import { isArrowFunctionExpression, isFunctionDeclaration } from './is';

export function getTypeServices<
  TMessageIds extends string,
  TOptions extends readonly unknown[],
>(context: TSESLint.RuleContext<TMessageIds, Readonly<TOptions>>) {
  const services = ESLintUtils.getParserServices(context);
  const { esTreeNodeToTSNodeMap, program, getTypeAtLocation } = services;
  const typeChecker = program.getTypeChecker();

  const couldBeType = (
    node: TSESTree.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    const type = getTypeAtLocation(node);
    return tsutilsEtcCouldBeType(
      type,
      name,
      qualified ? { ...qualified, typeChecker } : undefined,
    );
  };

  const couldReturnType = (
    node: TSESTree.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    let tsTypeNode: ts.Node | undefined;
    const tsNode = esTreeNodeToTSNodeMap.get(node);
    if (
      ts.isArrowFunction(tsNode)
      || ts.isFunctionDeclaration(tsNode)
      || ts.isMethodDeclaration(tsNode)
      || ts.isFunctionExpression(tsNode)
    ) {
      tsTypeNode = tsNode.type ?? tsNode.body; // TODO(#57): this doesn't work for Block bodies.
    } else if (
      ts.isCallSignatureDeclaration(tsNode)
      || ts.isMethodSignature(tsNode)
    ) {
      tsTypeNode = tsNode.type;
    } else if (
      ts.isPropertySignature(tsNode)
    ) {
      // TODO(#66): this doesn't work for functions assigned to class properties, variables, params.
    }
    return Boolean(
      tsTypeNode
      && tsutilsEtcCouldBeType(
        typeChecker.getTypeAtLocation(tsTypeNode),
        name,
        qualified ? { ...qualified, typeChecker } : undefined,
      ),
    );
  };

  return {
    couldBeBehaviorSubject: (node: TSESTree.Node) =>
      couldBeType(node, 'BehaviorSubject'),
    couldBeFunction: (node: TSESTree.Node) => {
      if (isArrowFunctionExpression(node) || isFunctionDeclaration(node)) {
        return true;
      }
      return couldBeFunction(getTypeAtLocation(node));
    },
    couldBeMonoTypeOperatorFunction: (node: TSESTree.Node) =>
      couldBeType(node, 'MonoTypeOperatorFunction'),
    couldBeObservable: (node: TSESTree.Node) => couldBeType(node, 'Observable'),
    couldBeSubject: (node: TSESTree.Node) => couldBeType(node, 'Subject'),
    couldBeSubscription: (node: TSESTree.Node) => couldBeType(node, 'Subscription'),
    couldBeType,
    couldReturnObservable: (node: TSESTree.Node) =>
      couldReturnType(node, 'Observable'),
    couldReturnType,
  };
}
