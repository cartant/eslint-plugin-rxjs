/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeFunction } from "tsutils-etc";
import * as ts from "typescript";
import { getParserServices } from "../utils";

const rule: Rule.RuleModule = {
    meta: {
        docs: {
            category: "RxJS",
            description: "Disallows operators that return connectable observables.",
            recommended: true
        },
        fixable: null,
        messages: {
            forbidden: "Connectable observables are forbidden."
        }
    },
    create: context => {
        const service = getParserServices(context);
        const typeChecker = service.program.getTypeChecker();
        const sourceCode = context.getSourceCode();
        function isConnectableCall(callee: es.CallExpression["callee"]): boolean {
            return (callee.type === "Identifier") && /(multicast|publish|publishBehavior|publishLast|publishReplay)/.test(sourceCode.getText(callee));
        }
        return {
            CallExpression: (node: es.CallExpression) => {
                const { callee } = node;
                if (isConnectableCall(callee)) {
                    let report = false;
                    if (sourceCode.getText(callee) === "multicast") {
                        report = node.arguments.length === 1;
                    } else {
                        const callExpression = service.esTreeNodeToTSNodeMap.get(node) as ts.CallExpression;
                        report = !callExpression.arguments.some(arg => {
                            const type = typeChecker.getTypeAtLocation(arg);
                            return couldBeFunction(type);
                        });
                    }
                    if (report) {
                        context.report({
                            messageId: "forbidden",
                            node: callee
                        });
                    }
                }
            }
        };
    }
};

export = rule;
