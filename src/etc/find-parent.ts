import { TSESTree } from '@typescript-eslint/utils';

type Predicate = (type: string) => 'break' | 'continue' | 'return';

export function findParent(node: TSESTree.Node, ...types: string[]): TSESTree.Node | undefined;
export function findParent(node: TSESTree.Node, predicate: Predicate): TSESTree.Node | undefined;
export function findParent(node: TSESTree.Node, ...args: (string | Predicate)[]): TSESTree.Node | undefined {
  const [arg] = args;
  const predicate: Predicate
    = typeof arg === 'function'
      ? arg
      : (type: string) => (!args.includes(type) ? 'continue' : 'return');
  let parent = node.parent as TSESTree.Node | undefined;
  while (parent) {
    switch (predicate(parent.type)) {
      case 'break':
        return undefined;
      case 'return':
        return parent;
      default:
        break;
    }
    parent = parent.parent;
  }
  return undefined;
}
