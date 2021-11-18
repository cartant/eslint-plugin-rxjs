<a name="4.0.3"></a>
## [4.0.3](https://github.com/cartant/eslint-plugin-rxjs/compare/v4.0.2...v4.0.3) (2021-11-19)

## Fixes

- Escape `RegExp` characters in the `suffix-subjects` rule's `suffix` option. See [this issue](https://github.com/cartant/eslint-plugin-etc/issues/88). ([a23a69c](https://github.com/cartant/eslint-plugin-etc/commit/a23a69c))
- Don't effect failures for inner `first`-like operators in the `no-unsafe-first` rule. See [this issue](https://github.com/cartant/eslint-plugin-etc/issues/89). ([19806a4](https://github.com/cartant/eslint-plugin-etc/commit/19806a4))

<a name="4.0.2"></a>
## [4.0.2](https://github.com/cartant/eslint-plugin-rxjs/compare/v4.0.1...v4.0.2) (2021-11-08)

## Fixes

- Don't effect failures in the `throw-error` rule when `unknown` is thrown. See [this issue](https://github.com/cartant/eslint-plugin-etc/issues/39). ([784f463](https://github.com/cartant/eslint-plugin-etc/commit/784f463))

<a name="4.0.1"></a>
## [4.0.1](https://github.com/cartant/eslint-plugin-rxjs/compare/v4.0.0...v4.0.1) (2021-10-26)

## Features

* Add `no-subscribe-handlers` rule. ([ea36a6d](https://github.com/cartant/eslint-plugin-rxjs/commit/ea36a6d))

<a name="4.0.0"></a>
## [4.0.0](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.7...v4.0.0) (2021-10-17)

## Breaking Changes

* Support `eslint` v8 and `@typescript-eslint` v5. ([644953a](https://github.com/cartant/eslint-plugin-rxjs/commit/644953a))

<a name="3.3.7"></a>
## [3.3.7](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.6...v3.3.7) (2021-08-29)

## Fixes

* Allow multiple `takeUntil` operators with other operators placed in between. ([e66478c](https://github.com/cartant/eslint-plugin-rxjs/commit/e66478c))

<a name="3.3.6"></a>
## [3.3.6](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.5...v3.3.6) (2021-08-14)

## Fixes

* Don't attempt to ban shallow/root operator imports - introduced in RxJS 7.2 - in the `ban-operators`. ([489a72e](https://github.com/cartant/eslint-plugin-rxjs/commit/489a72e))

<a name="3.3.5"></a>
## [3.3.5](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.4...v3.3.5) (2021-07-09)

## Fixes

* Support shallow/root operator imports - introduced in RxJS 7.2 - in the `ban-operators` and `no-tap` rules. ([009381f](https://github.com/cartant/eslint-plugin-rxjs/commit/009381f))

<a name="3.3.4"></a>
## [3.3.4](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.3...v3.3.4) (2021-06-26)

## Fixes

* Check for non-RxJS `takeWhile` imports in `no-ignored-takewhile-value`. ([476fc29](https://github.com/cartant/eslint-plugin-rxjs/commit/476fc29))

<a name="3.3.3"></a>
## [3.3.3](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.2...v3.3.3) (2021-05-29)

## Fixes

* Bump `eslint-etc` version. ([ca61caa](https://github.com/cartant/eslint-plugin-rxjs/commit/ca61caa))

<a name="3.3.2"></a>
## [3.3.2](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.1...v3.3.2) (2021-05-28)

## Fixes

* Support factories in the `throw-error` rule. ([f4e8835](https://github.com/cartant/eslint-plugin-rxjs/commit/f4e8835))

<a name="3.3.1"></a>
## [3.3.1](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.3.0...v3.3.1) (2021-05-19)

## Changes

* Remove the `no-subject-value` rule from recommended configuration. This was an oversight. Personally, I use the rule, but it's probably too opinionated to be in the recommended configuration. ([79b7bc0](https://github.com/cartant/eslint-plugin-rxjs/commit/79b7bc0))

<a name="3.3.0"></a>
## [3.3.0](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.2.0...v3.3.0) (2021-05-01)

## Features

* The `no-internal` rule now has a fixer. ([dc480b2](https://github.com/cartant/eslint-plugin-rxjs/commit/dc480b2))

<a name="3.2.0"></a>
## [3.2.0](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.1.5...v3.2.0) (2021-04-25)

## Features

* The `no-ignored-subscribe` and `no-nested-subscribe` rules now support types that implement `Subscribable`. ([57f6e3f](https://github.com/cartant/eslint-plugin-rxjs/commit/57f6e3f))

<a name="3.1.5"></a>
## [3.1.5](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.1.4...v3.1.5) (2021-04-08)

## Fixes

* Match only `subscribe` calls that are nested in arguments. ([0dc28aa](https://github.com/cartant/eslint-plugin-rxjs/commit/0dc28aa))

<a name="3.1.4"></a>
## [3.1.4](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.1.3...v3.1.4) (2021-04-05)

## Fixes

* Allow `takeUntil` after `takeUntil`. ([d1a2549](https://github.com/cartant/eslint-plugin-rxjs/commit/d1a2549))

<a name="3.1.3"></a>
## [3.1.3](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.1.2...v3.1.3) (2021-03-22)

## Fixes

* Set minimum `eslint-etc` version. ([4fae336](https://github.com/cartant/eslint-plugin-rxjs/commit/4fae336))

<a name="3.1.2"></a>
## [3.1.2](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.1.1...v3.1.2) (2021-03-20)

## Fixes

* Enable TypeScript's `strict` option and fix related problems. ([2bea9e0](https://github.com/cartant/eslint-plugin-rxjs/commit/2bea9e0))

<a name="3.1.1"></a>
## [3.1.1](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.1.0...v3.1.1) (2021-02-14)

## Changes

* Improve `no-unsafe-takeuntil` docs and fix failure message grammar. ([e3e8fed](https://github.com/cartant/eslint-plugin-rxjs/commit/e3e8fed))

<a name="3.1.0"></a>
## [3.1.0](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.0.1...v3.1.0) (2021-02-13)

## Features

* Added a `strict` option to the `finnish` rule. ([8bf0d1d](https://github.com/cartant/eslint-plugin-rxjs/commit/8bf0d1d))

<a name="3.0.1"></a>
## [3.0.1](https://github.com/cartant/eslint-plugin-rxjs/compare/v3.0.0...v3.0.1) (2021-02-03)

## Fixes

* Support arrow functions without parameter parentheses in `no-implicit-any-catch`. ([37427ad](https://github.com/cartant/eslint-plugin-rxjs/commit/37427ad))

<a name="3.0.0"></a>
## [3.0.0](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.7...v3.0.0) (2021-01-30)

## Breaking Changes

* Check for an `Observable` type in `no-implicit-any-catch` - a breaking change because the previous version of this rule didn't require type information. ([ebfb553](https://github.com/cartant/eslint-plugin-rxjs/commit/ebfb553))

## Fixes

* Check for an `Observable` type in `prefer-observer`. ([30012be](https://github.com/cartant/eslint-plugin-rxjs/commit/30012be))

<a name="2.1.7"></a>
## [2.1.7](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.6...v2.1.7) (2021-01-19)

## Fixes

* Don't insist on type references when checking for obserables. ([521fe55](https://github.com/cartant/eslint-plugin-rxjs/commit/521fe55))

<a name="2.1.6"></a>
## [2.1.6](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.5...v2.1.6) (2021-01-11)

## Changes

* Fix GitHub URL for docs. ([a238c2d](https://github.com/cartant/eslint-plugin-rxjs/commit/a238c2d))

<a name="2.1.5"></a>
## [2.1.5](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.4...v2.1.5) (2020-11-28)

## Changes

* Use `files` in `package.json` instead of `.npmignore`. ([99cb9ec](https://github.com/cartant/eslint-plugin-rxjs/commit/99cb9ec))

<a name="2.1.4"></a>
## [2.1.4](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.3...v2.1.4) (2020-11-21)

## Fixes

* Fixed a problem with `no-cyclic-action` when used with effects/epics that return `Observable<void>`. ([79b9e82](https://github.com/cartant/eslint-plugin-rxjs/commit/79b9e82))

<a name="2.1.3"></a>
## [2.1.3](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.2...v2.1.3) (2020-11-05)

## Fixes

* `no-ignored-subscription` should not effect failures for `Subscriber` instances passed to `subscribe`. ([72e11ec](https://github.com/cartant/eslint-plugin-rxjs/commit/72e11ec))

<a name="2.1.2"></a>
## [2.1.2](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.1...v2.1.2) (2020-11-03)

## Changes

* Use the public TypeScript API (`getTypeArguments`) to obtain the type arguments in the `no-cyclic-action` rule. ([7f55bcb](https://github.com/cartant/eslint-plugin-rxjs/commit/7f55bcb))

<a name="2.1.1"></a>
## [2.1.1](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.1.0...v2.1.1) (2020-11-03)

## Changes

* Use the public TypeScript API (`getTypeOfSymbolAtLocation`) to obtain the action type in the `no-cyclic-action` rule. ([56687db](https://github.com/cartant/eslint-plugin-rxjs/commit/56687db))

<a name="2.1.0"></a>
## [2.1.0](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.0.1...v2.1.0) (2020-11-03)

## Changes

* Added the `no-cyclic-action` rule for effects and epics. ([5e03092](https://github.com/cartant/eslint-plugin-rxjs/commit/5e03092))

<a name="2.0.1"></a>
## [2.0.1](https://github.com/cartant/eslint-plugin-rxjs/compare/v2.0.0...v2.0.1) (2020-11-03)

## Changes

* Update rule metadata.

<a name="2.0.0"></a>
## [2.0.0](https://github.com/cartant/eslint-plugin-rxjs/compare/v1.0.3...v2.0.0) (2020-10-29)

## Breaking Changes

* `no-implicit-any-catch` is now enforced for error callbacks - and error methods on observers - passed to `subscribe` and `tap`, too. ([1b9234b](https://github.com/cartant/eslint-plugin-rxjs/commit/1b9234b))

<a name="1.0.3"></a>
## [1.0.3](https://github.com/cartant/eslint-plugin-rxjs/compare/v1.0.2...v1.0.3) (2020-10-27)

## Changes

* Specify Node 10 as the minimum `engines` in `package.json` and downlevel to ES2018.

<a name="1.0.2"></a>
## [1.0.2](https://github.com/cartant/eslint-plugin-rxjs/compare/v1.0.1...v1.0.2) (2020-10-25)

## Changes

* Deprecate `no-tap` in favour of `ban-operators`. `no-do`/`no-tap` was an early TSLint rule and `ban-operators` is the preferred rule for banning operators as it allows a message to be specified.

<a name="1.0.1"></a>
## [1.0.1](https://github.com/cartant/eslint-plugin-rxjs/compare/v1.0.0...v1.0.1) (2020-10-23)

## Changes

* Specify `engines` in `package.json`.
* Downlevel the TypeScript output to ES2019.