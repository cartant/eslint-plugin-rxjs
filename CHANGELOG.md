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