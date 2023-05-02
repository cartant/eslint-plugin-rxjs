/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

export = {
  plugins: ["rxjs"],
  rules: {
    "rxjs/no-async-subscribe": "warn",
    "rxjs/no-create": "warn",
    "rxjs/no-ignored-notifier": "warn",
    "rxjs/no-ignored-replay-buffer": "warn",
    "rxjs/no-ignored-takewhile-value": "warn",
    "rxjs/no-implicit-any-catch": "warn",
    "rxjs/no-index": "warn",
    "rxjs/no-internal": "warn",
    "rxjs/no-nested-subscribe": "warn",
    "rxjs/no-redundant-notify": "warn",
    "rxjs/no-sharereplay": ["warn", { allowConfig: true }],
    "rxjs/no-subject-unsubscribe": "warn",
    "rxjs/no-unbound-methods": "warn",
    "rxjs/no-unsafe-subject-next": "warn",
    "rxjs/no-unsafe-takeuntil": "warn",
  },
};
