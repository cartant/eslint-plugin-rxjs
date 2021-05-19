/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

export = {
  plugins: ["rxjs"],
  rules: {
    "rxjs/no-async-subscribe": "error",
    "rxjs/no-create": "error",
    "rxjs/no-ignored-notifier": "error",
    "rxjs/no-ignored-replay-buffer": "error",
    "rxjs/no-ignored-takewhile-value": "error",
    "rxjs/no-implicit-any-catch": "error",
    "rxjs/no-index": "error",
    "rxjs/no-internal": "error",
    "rxjs/no-nested-subscribe": "error",
    "rxjs/no-redundant-notify": "error",
    "rxjs/no-sharereplay": ["error", { allowConfig: true }],
    "rxjs/no-subject-unsubscribe": "error",
    "rxjs/no-unbound-methods": "error",
    "rxjs/no-unsafe-subject-next": "error",
    "rxjs/no-unsafe-takeuntil": "error",
  },
};
