import { stripIndent } from 'common-tags';
import { noMisusedObservablesRule } from '../../src/rules/no-misused-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-misused-observables', noMisusedObservablesRule, {
  valid: [
    {
      code: stripIndent`
        // all checks disabled
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => of(i));

        const source = of(42);
        const foo = { ...source };
      `,
      options: [{ checksVoidReturn: false, checksSpreads: false }],
    },
    // #region valid; void return argument
    {
      code: stripIndent`
        // void return argument; explicitly allowed
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> => { return of(i); });
        [1, 2, 3].forEach(i => of(i));

        class Foo {
          constructor(x: () => void) {}
        }
        new Foo(() => of(42));
      `,
      options: [{ checksVoidReturn: { arguments: false } }],
    },
    stripIndent`
      // void return argument; unrelated
      [1, 2, 3].forEach(i => i);
      [1, 2, 3].forEach(i => { return i; });

      class Foo {
        constructor(x: () => void, y: number) {}
      }
      new Foo(() => 42, 0);
      new Foo;
    `,
    stripIndent`
      // couldReturnType is bugged for block body implicit return types (#57)
      import { of } from "rxjs";

      [1, 2, 3].forEach(i => { return of(i); });
    `,
    // #endregion valid; void return argument
    // #region valid; void return attribute
    {
      code: stripIndent`
        // void return attribute; explicitly allowed
        import { Observable, of } from "rxjs";
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void }> = () => <div />;
        const App = () => {
          return (
            <Component foo={() => of(42)} />
          );
        };
      `,
      options: [{ checksVoidReturn: { attributes: false } }],
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    {
      code: stripIndent`
        // void return attribute; unrelated
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void, bar: boolean }> = () => <div />;
        const App = () => {
          return (
            <Component foo={() => 42} bar />
          );
        };
      `,
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    // #endregion valid; void return attribute
    // #region valid; void return inherited method
    {
      code: stripIndent`
        // void return inherited method; explicitly allowed
        import { Observable, of } from "rxjs";

        class Foo {
          foo(): void {}
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
        }

        const Baz = class extends Foo {
          foo(): Observable<number> { return of(42); }
        }

        interface Qux extends Foo {
          foo(): Observable<number>;
        }
      `,
      options: [{ checksVoidReturn: { inheritedMethods: false } }],
    },
    stripIndent`
      // void return inherited method; not void
      import { Observable, of } from "rxjs";

      class Foo {
        foo(): Observable<number> { return of(42); }
        s(): void {}
      }

      class Bar extends Foo {
        foo(): Observable<number> { return of(43); }
        static s(): Observable<number> { return of(43); }
      }

      const Baz = class extends Foo {
        foo(): Observable<number> { return of(44); }
      }

      interface Qux extends Foo {
        foo(): Observable<45>;
      }
    `,
    stripIndent`
      // void return inherited method; unrelated
      class Foo {
        foo(): void {}
      }

      class Bar extends Foo {
        foo(): number { return 42; }
      }
    `,
    // #endregion valid; void return inherited method
    // #region valid; void return property
    {
      code: stripIndent`
        // void return property; explicitly allowed
        import { Observable, of } from "rxjs";

        type Foo = { a: () => void, b: () => void, c: () => void };
        const b: () => Observable<number> = () => of(42);
        const foo: Foo = {
          a: (): Observable<number> => of(42),
          b,
          c(): Observable<number> { return of(42); },
        };
      `,
      options: [{ checksVoidReturn: { properties: false } }],
    },
    stripIndent`
      // void return property; not void
      import { Observable, of } from "rxjs";

      type Foo = { a: () => Observable<number>, b: () => Observable<number>, c: () => Observable<number> };
      const b: () => Observable<number> = () => of(42);
      const foo: Foo = {
        a: () => of(42),
        b,
        c(): Observable<number> { return of(42); },
        d(): Observable<number> { return of(42); },
      };
    `,
    stripIndent`
      // void return property; unrelated
      import { Observable, of } from "rxjs";

      type Foo = { a: () => void, b: () => void, c: () => void };
      const b: () => number = () => 42;
      const foo: Foo = {
        a: () => 42,
        b,
        ['c'](): number { return 42; },
      };
      const bar = {
        a(): Observable<number> { return of(42); },
      }
    `,
    stripIndent`
      // computed property name for method declaration is not supported
      import { Observable, of } from "rxjs";

      type Foo = { a: () => void };
      const foo: Foo = {
        ['a'](): Observable<number> { return of(42); },
      };
    `,
    stripIndent`
      // couldReturnType is bugged for variables (#66)
      import { Observable, of } from "rxjs";

      type Foo = { bar: () => void };
      const bar: () => Observable<number> = () => of(42);
      const foo: Foo = {
        bar,
      };
    `,
    // #endregion valid; void return property
    // #region valid; void return return value
    {
      code: stripIndent`
        // void return return value; explicitly allowed
        import { Observable, of } from "rxjs";

        function foo(): () => void {
          return (): Observable<number> => of(42);
        }
      `,
      options: [{ checksVoidReturn: { returns: false } }],
    },
    stripIndent`
      // void return return value; not void
      import { Observable, of } from "rxjs";

      function foo(): () => Observable<number> {
        return (): Observable<number> => of(42);
      }
    `,
    stripIndent`
      // void return return value; unrelated
      function foo(): () => number {
        return (): number => 42;
      }
      function bar(): () => void {
        return (): number => 42;
      }
      function baz(): () => void {
        return (): void => { return; };
      }
    `,
    // #endregion valid; void return return value
    // #region valid; void return variable
    {
      code: stripIndent`
        // void return variable; explicitly allowed
        import { Observable, of } from "rxjs";

        let foo: () => void;
        foo = (): Observable<number> => of(42);
        const bar: () => void = (): Observable<number> => of(42);
      `,
      options: [{ checksVoidReturn: { variables: false } }],
    },
    stripIndent`
      // void return variable; not void
      import { Observable, of } from "rxjs";

      let foo: () => Observable<number>;
      foo = () => of(42);
    `,
    stripIndent`
      // void return variable; unrelated
      let foo: () => void;
      foo = (): number => 42;
    `,
    // #endregion valid; void return variable
    // #region valid; spread
    {
      code: stripIndent`
        // spread; explicitly allowed
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
      `,
      options: [{ checksSpreads: false }],
    },
    stripIndent`
      // spread; unrelated
      const foo = { bar: 42 };
      const baz = { ...foo };
    `,
    // #endregion valid; spread
  ],
  invalid: [
    // #region invalid; void return argument
    fromFixture(
      stripIndent`
        // void return argument; block body
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> => { return of(i); });
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; inline body
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => of(i));
                          ~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; block body; union return
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> | number => { if (i > 1) { return of(i); } else { return i; } });
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; inline body; union return
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => i > 1 ? of(i) : i);
                          ~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; constructor
        import { of } from "rxjs";

        class Foo {
          constructor(x: () => void) {}
        }
        new Foo(() => of(42));
                ~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    // #endregion invalid; void return argument
    // #region invalid; void return attribute
    fromFixture(
      stripIndent`
        // void return attribute; block body
        import { Observable, of } from "rxjs";
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void }> = () => <div />;
        const App = () => {
          return (
            <Component foo={(): Observable<number> => { return of(42); }} />
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnAttribute]
          );
        };
      `,
      {
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      },
    ),
    fromFixture(
      stripIndent`
        // void return attribute; inline body
        import { Observable, of } from "rxjs";
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void }> = () => <div />;
        const App = () => {
          return (
            <Component foo={() => of(42)} />
                           ~~~~~~~~~~~~~~ [forbiddenVoidReturnAttribute]
          );
        };
      `,
      {
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      },
    ),
    // #endregion invalid; void return attribute
    // #region invalid; void return inherited method
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; extends
        import { Observable, of } from "rxjs";

        class Foo {
          foo(): void {}
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; abstract extends
        import { Observable } from "rxjs";

        class Foo {
          foo(): void {}
        }

        abstract class Bar extends Foo {
          abstract foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; extends abstract
        import { Observable, of } from "rxjs";

        abstract class Foo {
          abstract foo(): void;
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; abstract extends abstract
        import { Observable } from "rxjs";

        abstract class Foo {
          abstract foo(): void;
        }

        abstract class Bar extends Foo {
          abstract foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; implements
        import { Observable, of } from "rxjs";

        interface Foo {
          foo(): void;
        }

        class Bar implements Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; abstract implements
        import { Observable } from "rxjs";

        interface Foo {
          foo(): void;
        }

        abstract class Bar implements Foo {
          abstract foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; implements type intersection
        import { Observable, of } from "rxjs";

        type Foo = { foo(): void } & { bar(): void };

        class Bar implements Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
          bar(): void {}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; extends and implements
        import { Observable, of } from "rxjs";

        interface Foo {
          foo(): Observable<void>;
        }

        interface Bar {
          foo(): void;
        }

        class Baz {
          foo(): void {}
        }

        class Qux extends Baz implements Foo, Bar {
          foo(): Observable<void> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Baz" }]
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Bar" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class declaration; extends class expression
        import { Observable, of } from "rxjs";

        const Foo = class {
          foo(): void {}
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class expression; extends
        import { Observable, of } from "rxjs";

        const Foo = class {
          foo(): void {}
        }

        const Bar = class extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; class expression; implements
        import { Observable, of } from "rxjs";

        interface Foo {
          foo(): void;
        }

        const Bar = class implements Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends class
        import { Observable } from "rxjs";

        class Foo {
          foo(): void {}
        }

        interface Bar extends Foo {
          foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends abstract
        import { Observable } from "rxjs";

        abstract class Foo {
          abstract foo(): void;
        }

        interface Bar extends Foo {
          foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends interface
        import { Observable } from "rxjs";

        interface Foo {
          foo(): void;
        }

        interface Bar extends Foo {
          foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends conditional type
        import { Observable } from "rxjs";

        type Foo<IsRx extends boolean = true> = IsRx extends true
          ? { foo(): Observable<void> }
          : { foo(): void };

        interface Bar extends Foo<false> {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "{ foo(): void; }" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends multiple
        import { Observable } from "rxjs";

        interface Foo {
          foo(): void;
        }

        interface Bar {
          foo(): void;
        }

        interface Baz extends Foo, Bar {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Bar" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends multiple classes
        import { Observable } from "rxjs";

        class Foo {
          foo(): void {}
        }

        class Bar {
          foo(): void {}
        }

        interface Baz extends Foo, Bar {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Bar" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends typeof class
        import { Observable } from "rxjs";

        const Foo = class {
          foo(): void {}
        }

        type Bar = typeof Foo;

        interface Baz extends Bar {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "typeof Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends function, index, constructor
        import { Observable } from "rxjs";

        interface Foo {
          (): void;
          (arg: string): void;
          new (): void;
          [key: string]: () => void;
          [key: number]: () => void;
          myMethod(): void;
        }

        interface Bar extends Foo {
          (): Observable<void>;
          (arg: string): Observable<void>;
          new (): Observable<void>;
          [key: string]: () => Observable<void>;
          [key: number]: () => Observable<void>;
          myMethod(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return inherited method; interface; extends multiple function, index, constructor
        import { Observable } from "rxjs";

        interface Foo {
          (): void;
          (arg: string): void;
        }

        interface Bar {
          [key: string]: () => void;
          [key: number]: () => void;
        }

        interface Baz {
          new (): void;
          new (arg: string): void;
        }

        interface Qux {
          doSyncThing(): void;
          doOtherSyncThing(): void;
          syncMethodProperty: () => void;
        }

        interface Quux extends Foo, Bar, Baz, Qux {
          (): void;
          (arg: string): Observable<void>;
          new (): void;
          new (arg: string): void;
          [key: string]: () => Observable<void>;
          [key: number]: () => void;
          doSyncThing(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Qux" }]
          doRxThing(): Observable<void>;
          syncMethodProperty: () => Observable<void>;
          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Qux" }]
          // TODO(#66): couldReturnType doesn't work for properties.
        }
      `,
    ),
    // #endregion invalid; void return inherited method
    // #region invalid; void return property
    fromFixture(
      stripIndent`
        // void return property; arrow function
        import { of } from "rxjs";

        type Foo = { bar: () => void };
        const foo: Foo = {
          bar: () => of(42),
               ~~~~~~~~~~~~ [forbiddenVoidReturnProperty]
        };
      `,
    ),
    fromFixture(
      stripIndent`
        // void return property; function
        import { Observable, of } from "rxjs";

        type Foo = { bar: () => void };
        const foo: Foo = {
          bar(): Observable<number> { return of(42); },
             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnProperty]
        };
      `,
    ),
    // #endregion invalid; void return property
    // #region invalid; void return return value
    fromFixture(
      stripIndent`
        // void return return value; arrow function
        import { Observable, of } from "rxjs";

        function foo(): () => void {
          return (): Observable<number> => of(42);
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnReturnValue]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // void return return value; function
        import { Observable, of } from "rxjs";

        function foo(): () => void {
          return function(): Observable<number> { return of(42); };
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnReturnValue]
        }
      `,
    ),
    // #endregion invalid; void return return value
    // #region invalid; void return variable
    fromFixture(
      stripIndent`
        // void return variable; reassign
        import { of } from "rxjs";

        let foo: () => void;
        foo = () => of(42);
              ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return variable; const
        import { of } from "rxjs";

        const foo: () => void = () => of(42);
                                ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
        const bar = () => of(42), baz: () => void = () => of(42);
                                                    ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return variable; nested
        import { of } from "rxjs";

        const foo: {
          bar?: () => void;
        } = {};
        foo.bar = () => of(42);
                  ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return variable; Record
        import { of } from "rxjs";

        const foo: Record<string, () => void> = {};
        foo.bar = () => of(42);
                  ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    // #endregion invalid; void return variable
    // #region invalid; spread
    fromFixture(
      stripIndent`
        // spread variable
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
                         ~~~~~~ [forbiddenSpread]
      `,
    ),
    fromFixture(
      stripIndent`
        // spread call function
        import { of } from "rxjs";

        function source() {
          return of(42);
        }
        const foo = { ...source() };
                         ~~~~~~~~ [forbiddenSpread]
      `,
    ),
    // #endregion invalid; spread
  ],
});
