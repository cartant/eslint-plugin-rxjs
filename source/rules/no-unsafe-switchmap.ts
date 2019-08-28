/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import decamelize from "decamelize";
import { Rule } from "eslint";
import esquery from "esquery";
import * as es from "estree";
import { isCallExpression, isIdentifier, isLiteral, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows unsafe switchMap usage in Effects and epics.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Unsafe switchMap usage in Effects and epics is forbidden."
    },
    schema: [
      {
        properties: {
          allow: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } }
            ]
          },
          disallow: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } }
            ]
          },
          observable: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } }
            ]
          }
        },
        type: "object",
        description: stripIndent`
          An optional object with optional \`allow\`, \`disallow\` and \`observable\` properties.
          The properties can be specified as regular expression strings or as arrays of words.
          The \`allow\` or \`disallow\` properties are mutually exclusive. Whether or not
          \`switchMap\` is allowed will depend upon the matching of action types with \`allow\` or \`disallow\`.
          The \`observable\` property is used to identify the action observables from which effects and epics are composed.
        `
      }
    ]
  },
  create: context => {
    const defaultObservable = "action(s|\\$)?";
    const defaultDisallow = [
      "add",
      "create",
      "delete",
      "post",
      "put",
      "remove",
      "set",
      "update"
    ];

    function createRegExp(value: any): RegExp | null {
      if (!value || !value.length) {
        return null;
      }
      const flags = "i";
      if (typeof value === "string") {
        return new RegExp(value, flags);
      }
      const words = value as string[];
      const joined = words.map(word => `(\\b|_)${word}(\\b|_)`).join("|");
      return new RegExp(`(${joined})`, flags);
    }

    let allowRegExp: RegExp | null;
    let disallowRegExp: RegExp | null;
    let observableRegExp: RegExp;

    const [config] = context.options;
    if (config && (config.allow || config.disallow)) {
      allowRegExp = createRegExp(config.allow);
      disallowRegExp = createRegExp(config.disallow);
      observableRegExp = new RegExp(config.observable || defaultObservable);
    } else {
      allowRegExp = null;
      disallowRegExp = createRegExp(defaultDisallow);
      observableRegExp = new RegExp(defaultObservable);
    }

    const { couldBeObservable, isReferenceType } = typecheck(context);

    function shouldDisallow(args: es.Node[]): boolean {
      const names = args
        .map(arg => {
          if (isLiteral(arg) && typeof arg.value === "string") {
            return arg.value;
          }
          if (isIdentifier(arg)) {
            return arg.name;
          }

          return "";
        })
        // tslint:disable-next-line: no-unnecessary-callback-wrapper
        .map(name => decamelize(name));

      if (allowRegExp) {
        return !names.every(name => allowRegExp.test(name));
      }
      if (disallowRegExp) {
        return names.some(name => disallowRegExp.test(name));
      }

      return false;
    }

    function report(node: es.CallExpression) {
      if (
        !node.arguments ||
        !isReferenceType(node) ||
        !couldBeObservable(node)
      ) {
        return;
      }

      const hasInvalidOfType = node.arguments.some(arg => {
        if (
          isCallExpression(arg) &&
          isIdentifier(arg.callee) &&
          arg.callee.name === "ofType"
        ) {
          return shouldDisallow(arg.arguments);
        }
      });

      if (hasInvalidOfType) {
        const switchMapNodes = esquery(
          node,
          "[arguments] > CallExpression > Identifier[name='switchMap']"
        ) as es.Identifier[];
        switchMapNodes.forEach(switchMapNode => {
          context.report({
            messageId: "forbidden",
            node: switchMapNode
          });
        });
      }
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]: report,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]: report
    };
  }
};

export = rule;
