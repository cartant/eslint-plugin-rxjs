# Contributing

## Issues

To submit a bug or feature request, please first:

1. Use the latest version of this plugin.
2. Search existing issues, including closed issues, for your issue.
    - Since this plugin is a fork, please search the previous repositories too: `cartant/eslint-plugin-rxjs` and `cartant/rxjs-tslint-rules`.
    - Even if your issue is different, please feel free to link to related issues for context. It really helps!

## Getting Started

To start working an issue, first fork this repository.

Then install Yarn with corepack (included in all modern versions of Node.js):

```sh
corepack enable
```

Then run `yarn` in this repository to restore packages.

## Working

### Building

Run `yarn build` to build this plugin into the `dist` folder.

### Linting

Use `yarn lint` to run all linters (ESLint, markdownlint, and eslint-doc-generator).
If the eslint-doc-generator lint step fails,
you may need to run `yarn docs` to auto-update the rule documentation based on your changes.

All linting must pass for a pull request to be accepted.
We recommend you use the VS Code plugins for ESLint and markdownlint during development.

### Testing

Use `yarn test` to run the tests in watch mode.
We use [vitest](https://vitest.dev) for unit testing.

All unit tests must pass for a pull request to be accepted.
We also enforce code coverage, which you can check with `yarn coverage --coverage.reporter text`.

## Pull Request

For major changes, before submitting a PR, please submit an Issue so the change can be discussed first.

This repository uses conventional commits.
Essentially this means the title of your PR should be formatted like this:

```text
<type>(<area>): <desc>
```

If the PR involves a breaking changes, put an exclamation mark before the colon.
The body of the PR should start with "BREAKING CHANGE:" and describe the change clearly.

The `<area>` may be a specific rule name, config name, or a more broad category.

### Examples

```text
feat(prefer-root-operators): new rule for banning `rxjs/operators`
```

```text
fix(no-ignored-error): check observer object too, not just callbacks
```

```text
docs(no-async-subscribe): additional reasoning behind this rule
```

```text
chore(deps-dev): bump @eslint/plugin-kit from 0.2.2 to 0.2.3
```

```text
feat(throw-error)!: stop linting throw statements

BREAKING CHANGE: regular JavaScript `throw` statements will no longer be handled by this rule.
```

### Types

- `feat`: new functionality
- `fix`: bug fixes
- `docs`: only documentation changes
- `test`: only unit test changes
- `chore`: any other changes (e.g. CI/CD, dependencies, repo maintenance)

You may also see `refactor` and `style` in this repository.

### Reviews

After submitting a PR, your PR will be reviewed by the code owners of this repository.
Please work with us to address any feedback, which may include but is not limited to:

- Functional changes
- Test coverage
- Splitting PR into separate requests
- Small amounts of bike-shedding

Address each requested change and/or respond using line comments, then re-request a review.
Once your PR is approved, we will merge it and publish the change in a reasonable amount of time.
