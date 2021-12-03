/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/naming-convention */
import type { Merge, ValueOf } from 'type-fest';
import type { MagicModules } from './magic-modules';

/**
 * The standard global names `loader.js` exposes itself as.
 *
 * @remarks If you need to run two instances of `loader.js`, you can use
 * `loader.noConflict({ ... })` on the second instance to restore the globals of
 * the former instance. Just be aware, that this of course has a global effect
 * and could cause other code to lose access to the right `loader.js` instance.
 *
 * @see Loader#noConflict
 *
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L1
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L37-L44
 */
export interface Globals<
  L extends Loader = Loader,
  R extends Require = Require,
  D extends Define = Define
> {
  /**
   * @see Require
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L46
   */
  require: R;

  /**
   * @see Require
   * @deprecated Use `require` instead, if possible. This is just an alias.
   */
  requirejs?: R;

  /**
   * @see Require
   * @deprecated Use `require` instead, if possible. This is just an alias.
   */
  requireModule?: R;

  /**
   * @see Loader
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L60-L77
   */
  loader: L;

  /**
   * @see Define
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L216-L243
   */
  define: D;
}

/**
 * The standard global names `loader.js` exposes itself as, including deprecated
 * global names.
 *
 * @deprecated Prefer using {@link Globals} instead.
 *
 * @remarks If you need to run two instances of `loader.js`, you can use
 * `loader.noConflict({ ... })` on the second instance to restore the globals of
 * the former instance. Just be aware, that this of course has a global effect
 * and could cause other code to lose access to the right `loader.js` instance.
 *
 * @see Loader#noConflict
 *
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L1
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L37-L44
 */
export interface DeprecatedGlobals<
  L extends Loader = Loader,
  R extends Require = Require,
  D extends Define = Define
> extends Globals<L, R, D> {
  /**
   * @see Require
   * @deprecated Use {@link Globals#require} instead, if possible. This is just
   * an alias.
   */
  requirejs: R;

  /**
   * @see Require
   * @deprecated Use {@link Globals#require} instead, if possible. This is just
   * an alias.
   */
  requireModule: R;
}

/**
 * Configuration options for `loader.js`.
 * Exposed as `loader` global by default.
 *
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L60-L77
 */
export interface Loader {
  /**
   * To prevent the loader from overriding `require`, `define`, or `requirejs`
   * you can instruct the loader to use no conflict mode by providing it an
   * alternative name for the various globals that are normally used.
   *
   * @remarks You wouldn't normally need to call this, as you'd likely never
   * need to create your own `loader.js` instance. If you need to run two
   * instances of `loader.js`, you can use `loader.noConflict({ ... })` on the
   * second instance to restore the globals of the former instance.
   *
   * @note Just be aware, that this of course has a global effect and could
   * cause other code to lose access to the right `loader.js` instance. For
   * instance, calling this on the default & only instance would effectively
   * make `loader.js` erase itself from the global scope by restoring the
   * previous values, which were `undefined`. So don't call this unless you
   * really know what you're doing and have full control over your `loader.js`
   * instance.
   *
   * @example
   * ```ts
   * loader.noConflict({
   *   loader: 'newLoader',
   *   define: 'newDefine',
   *   requireModule: 'newRequireModule',
   *   require: 'newRequire',
   *   requirejs: 'newRequirejs',
   * });
   * ```
   *
   * @remarks All keys are optional, but omitting a key means that the potential
   * prior value assigned to that global will remain shadowed.
   *
   * @see https://github.com/ember-cli/loader.js#no-conflict
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L61-L74
   */
  noConflict(
    aliases: Partial<Record<keyof DeprecatedGlobals, string | undefined>>
  ): void;

  /**
   * Option to enable or disable the generation of `default` exports for strict
   * AMD compatibility.
   *
   * If the module expo
   *
   *
   * @default true
   * @see Module#makeDefaultExport
   * @see https://github.com/ember-cli/loader.js#makedefaultexport
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L115-L122
   */
  makeDefaultExport: boolean;

  /**
   * It is possible to the hook loader to augment or transform the loaded code.
   *
   * `wrapModules` is an optional method on the loader that is called as each
   * module is originally loaded.
   *
   * @param name The module name.
   * @param callback The original AMD callback.
   * @returns Used in subsequent requests for `name`.
   *
   * @remarks This functionality is useful for instrumenting code, for instance
   * in code coverage libraries.
   *
   * @see https://github.com/ember-cli/loader.js#wrapmodules
   *
   * @example
   * ```ts
   * loader.wrapModules = (
   *   name: string,
   *   callback: (...deps: unknown[]) => unknown
   * ) => {
   *   if (shouldTransform(name)) return transform(name, callback);
   *   return callback;
   * };
   */
  wrapModules?<
    Id extends string,
    TExports extends Exports = {},
    Deps extends string[] = DefaultDeps
  >(
    name: Id,
    callback: ModuleCallback<TExports, Deps, Id>
  ): ModuleCallback<TExports, Deps, Id>;
}

/**
 * These are some of the helpers which are used internally by `loader.js`. They
 * are not exposed and just here for purpose of documentation .
 * @internal
 */
export interface InternalHelpers {
  /**
   * Resolves any relative path segments (`./`, `../`) in the module path `dep`,
   * using `id` as the path base.
   *
   * @internal
   * @param dep The module path to resolve.
   * @param id The path of the requesting module. If `dep` is relative, it will
   * be resolved against `id`.
   * @returns The absolute module path.
   * @throws If trying to navigate beyond the root: `resolve('../foo', 'bar')`
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L302-L325
   */
  resolve(dep: string, id: string): string;

  /**
   * Whether a module with the name `id` is registered and could be required.
   * With "registered" meaning: It may be known, but need to be reified /
   * finalized yet, e.g. it hasn't been required yet.
   *
   * @remarks When `id` could not be found, `${id}/index` is automatically tried
   * as well.
   *
   * @internal
   * @see InternalHelpers#resolve
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L327-L329
   */
  has(id: string): boolean;

  /**
   * Looks up a module from the registry and recursively traverses its full
   * dependency graph to add all modules that are not yet reified into the
   * `pending` queue, so that the invoking code, `require(id)` in that case, can
   * reify them in one go.
   *
   * @param id The ID of the module to lookup.
   * @param referrer The ID of the module that requested the lookup.
   * @param pending Module reification queue of the module graph that is being
   * looked up.
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L284-L300
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L49-L54
   */
  findModule<
    Id extends string,
    TExports extends Exports,
    Deps extends string[]
  >(
    id: Id,
    referrer: string,
    // `false` is used internally instead of `undefined` for some reason. ¯\_(ツ)_/¯
    pending?: Module<string>[] | false
  ): Module<Id, TExports, Deps>;
}

/**
 * Each `Module` normally passes through these states, in order:
 *
 * - new       : initial state
 * - pending   : this module is scheduled to be executed
 * - reifying  : this module's dependencies are being executed
 * - reified   : this module's dependencies finished executing successfully
 * - errored   : this module's dependencies failed to execute
 * - finalized : this module executed successfully
 *
 * @see Module#state
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L102-L111
 */
export type ModuleState =
  | 'new'
  | 'pending'
  | 'reifying'
  | 'reified'
  | 'errored'
  | 'finalized';

/**
 * Passed to `define(id, deps, callback)` as the last parameter. Invoked when
 * the module with name `id` is required to create the module exports.
 *
 * @param this Access to the internal enwrapping `Module` object.
 * @param deps The resolved dependencies as specified in the
 * `define(id, deps, callback)` call that this `callback` was passed in.
 * @returns If the `deps` do not include the magic `'exports'` dependency, the
 * return value will be used as the module export. If the `'exports'` dependency
 * is declared in `deps`, the return value will be discarded.
 *
 * @see Define
 * @see Module
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L130-L136
 */
export type ModuleCallback<
  TExports extends Exports,
  Deps extends string[],
  // Intentionally breaking the standard order of `<Id, Exports, Deps>` here, as
  // `Id` only plays a very minor role in this type definition, but cannot be
  // inferred automatically. As TypeScript supports no partial type argument
  // inference, we place it last and provide a default type.
  // https://github.com/microsoft/TypeScript/pull/26349
  Id extends string = string
> = (
  this: Module<Id, TExports, Deps>,
  ...deps: {
    [K in keyof Deps]: Deps[K] extends keyof MagicModules<Id, TExports>
      ? MagicModules<Id, TExports>[Deps[K]]
      : unknown;
  }
) => TExports;

/**
 * You can set properties on this object for them to be exported, but you
 * can't replace the object itself. Use `module` for this.
 *
 * @see MagicModules#module
 * @see Module#module
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L190-L193
 */
export interface Exports {
  default?: unknown;
}

/**
 * An entry of the `Require#entries` module registry.
 * Created via `define(...)` & loaded via `require(id)`.
 *
 * @note Normally you shouldn't have to interact with this behind-the-scenes
 * implementation detail, but if you must, treat it as readonly access.
 *
 * @see Require#entries
 * @see Define
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L91-L214
 */
export interface Module<
  Id extends string = string,
  TExports extends Exports = {},
  Deps extends string[] = DefaultDeps,
  IsAlias extends boolean = false
> {
  /**
   * Unique identifier of this `Module`.
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L93
   */
  readonly uuid: number;

  /**
   * The name of this module that can be used by other modules to express a
   * dependency onto this module.
   */
  readonly id: Id;

  /**
   * @default DefaultDeps If the `deps` in `define(id, callback)` are omitted,
   * but `callback` accepts parameters, the `deps` will default to:
   * `['require', 'exports', 'module']`
   */
  readonly deps: Deps;

  /**
   * Holds this module's exported members as `exports`, once it has been reified
   * by `Module#exports()`.
   *
   * @remarks The additional wrapping of `exports` inside an otherwise object
   * allows to pass around a stable reference and e.g. completely replace the
   * value of `exports`, with e.g. a primitive, instead of only being able to
   * set properties on it.
   *
   * @see Module#exports
   */
  readonly module: { exports: TExports };

  /**
   * The `callback` passed to `define(id, deps, callback)`. Called with the
   * module's resolved & reified `deps` from `Module#exports()` to reify the
   * module itself. Its return value becomes the value of `this.module.exports`.
   *
   * @note In the special case of `AliasModule`s, this is not a callback, but
   * the `Alias`.
   *
   * @internal
   * @see Define
   * @see Module#exports
   * @see AliasModule
   */
  readonly callback: IsAlias extends true
    ? Alias<Id>
    : ModuleCallback<TExports, Deps, Id>;

  /**
   * Whether the magic `'exports'` dependency is included in `this.deps`.
   *
   * - If `true`, the module `callback` is expected to assign its exports to the
   *   `exports` parameter. The return value of the `callback` will be
   *   discarded.
   * - If `false`, the return value of the `callback` will be used as the
   *   export value. This would allow you to even return primitive types instead
   *   of objects. Check `define` for more infos.
   *
   * @see Define
   * @see Module#deps
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L190-L193
   * @see Module#exports
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L140-L142
   */
  readonly hasExportsAsDep: boolean;

  /**
   * Whether this package is an alias linking to another module.
   *
   * @see AliasModule
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L288-L290
   */
  readonly isAlias: IsAlias;

  /**
   * Temporarily holds the dependencies of this module, until the module itself
   * is reified. The reification is normally kicked off from `Module#exports()`,
   * but is implemented inside `Module#_reify()`, which is called by
   * `Module#reify()`.
   *
   * @note After`Module#exports()` has internally passed the `this.reified`
   * array to the `this.callback`, it clears the array to free up memory and
   * avoid memory leaks.
   *
   * @internal
   * @see Module#exports
   * @see Module#reify
   * @see Module#findDeps
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L172
   */
  readonly reified: // This array exists in two different forms.
  /**
   * Before reification occurs, during the `findDeps` phase.
   * @see Module#findDeps
   */
  | (
        | /**
         * If the `exports` for this dependency are already known at this stage,
         * they are passed as `exports` and the `module` reference is omitted.
         * In the current implementation this only occurs for the magic
         * dependencies: `require`, `exports`, `module`
         *
         * @see MagicDependencies
         * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L190-L197
         */
        { exports: ValueOf<MagicModules<Id, TExports>>; module: undefined }

        /**
         * If the `exports` are not known at this stage, the `Module` is passed
         * instead, so that it can later be reified.
         *
         * @see Module#_reify
         * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L172
         */
        | { exports: undefined; module: Module }
      )[]

    /**
     * After reification, inside `Module#exports()`.
     *
     * Contains the reified exports in order of declared `deps`. They are passed
     * as-is to the `callback`.
     *
     * @note Afterwards the `reified` array is cleared to free up memory.
     * @see Module#exports
     * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L134-L138
     */
    | unknown[];

  /**
   * The current state this `Module` is in. It will transition these states from
   * top to bottom.
   *
   * - new       : initial state
   * - pending   : this module is scheduled to be executed
   * - reifying  : this module's dependencies are being executed
   * - reified   : this module's dependencies finished executing successfully
   * - errored   : this module's dependencies failed to execute
   * - finalized : this module executed successfully
   */
  readonly state: ModuleState;

  /**
   * Invoked conditionally from `Module#exports()` to re-expose the module
   * exports object as `default` on itself, if there is no `default` export
   * already and `loader.makeDefaultExport` is enabled.
   *
   * @internal
   * @see Loader#makeDefaultExport
   * @see Module#exports
   * @see https://github.com/ember-cli/loader.js#makedefaultexport
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L115-L122
   */
  makeDefaultExport(): void;

  /**
   * Called internally by `require(id)` and during `Module` reification.
   *
   * @note This clears `reified` to clear up memory, as it's no longer needed.
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L137
   *
   * @internal
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L124-L147
   */
  exports(): TExports;

  /**
   * Allows you to unload a given module. This is quite useful, especially for
   * test suites.
   * Being able to unload run tests, mitigates many common memory leaks.
   *
   * @note The side-effects of that module cannot be unloaded.
   *
   * @see Require#unsee
   * @see https://github.com/ember-cli/loader.js#requireunseefoo
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L149-L152
   */
  unsee(): void;

  /**
   * Reifies the dependencies. Called from inside `Module#exports()`.
   *
   * @internal
   * @see Module#reified
   * @see Module#exports
   * @see Module#_reify
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L154-L165
   */
  reify(): void;

  /**
   * Called inernally from `Modules#reify()`.
   *
   * @internal
   * @see Module#reified
   * @see Module#reify
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L167-L175
   */
  _reify(): void;

  /**
   * Builds the first intermediary representation of the `reified` array, by
   * resolving every dependency listed in `deps` via `findModule(...)`.
   *
   * Resolves `deps` and builds up the `reified` array in the same order.
   *
   * The reified array will then contain  of yet to be reified depende
   *
   * @internal
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L177-L201
   */
  findDeps(pending: boolean): void;

  /**
   * Used internally to generate the local-relative `require` dependency.
   *
   * @internal
   * @see LocalRequire
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L203-L214
   */
  makeRequire(): LocalRequire<Id, TExports>;
}

/**
 * A special `Module` with `isAlias = true`, that is created via
 * `define.alias(...)` and links to another `Module` in the registry.
 *
 * @see Module#isAlias
 * @see InternalHelpers#findModule
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L288-L290
 * @see Define#alias
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L272-L278
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L237-L239
 */
export interface AliasModule<Id extends string>
  extends Omit<
    Module<Id /* Yes, this is correct */, {}, [], true>,
    'callback'
  > {
  /** @inheritDoc */
  readonly isAlias: true;

  /**
   * @see InternalHelpers#findModule
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L288-L290
   */
  readonly callback: Alias<Id>;
}

/**
 * @see Define#alias
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L268-L270
 */
export interface Alias<Id extends string> {
  readonly id: Id;
}

/**
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L89
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L95
 */
export type DefaultDeps =
  | []
  | [require: 'require']
  | [require: 'require', exports: 'exports']
  | [require: 'require', exports: 'exports', module: 'module'];

/**
 * Used to register new modules.
 * Exposed as `define` global by default.
 *
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L216-L262
 */
export interface Define {
  /**
   * Defines a new `Module`, so that it may be reified later, when resolved.
   *
   * @param id The module name other modules can refer to.
   * @param deps Optional. A list of dependencies to be supplied to
   * `callback(...deps)` in the same order.
   * @param callback The callback is executed with the resolved `deps` in order
   * of specification, and with `this` being bound to the `Module` itself.
   *
   * @example
   * ```ts
   * define('foo/bar', ['exports', 'foo/quux'], function (exports, quux) {
   *   'use strict';
   *
   *   Object.defineProperty(exports, '__esModule', {
   *     value: true
   *   });
   *
   *   // `import * as quux from 'foo/quux';
   *   console.log(quux); // => { default: '...', someNamedExport: '...', ...}
   *
   *   // `export default 'the default export';`
   *   exports.default = 'the default export';
   *   // Would be imported as:`import bar from 'foo/bar';`
   *
   *   // `export const zapp = 'a named export with the name `zapp`';
   *   exports.zapp = 'a named export with the name `zapp`';
   *   // Would be imported as:`import { zapp } from 'foo/bar';`
   * });
   *
   * @example
   * ```ts
   * // `random` is computed once on first lookup and then cached.
   * define('random', () => Math.random());
   *
   * // Creates `some/other/name'`, so that it links to `random`.
   * define('some/other/name', define.alias('random'));
   *
   * // Resolves as `random`.
   * require('some/other/name') // => 0.123456789;
   *
   * // Identity is the same.
   * require('random') === require('some/other/name');
   * ```
   * @see Define#alias
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L216-L243
   */
  <Id extends string, TExports extends Exports, Deps extends string[]>(
    id: Id,
    deps: Deps,
    callback: ModuleCallback<TExports, Deps, Id>
  ): void;
  <Id extends string, TExports extends Exports, Deps extends DefaultDeps>(
    id: Id,
    callback: ModuleCallback<TExports, Deps, Id>
  ): void;
  <Id extends string>(id: Id, alias: Alias<string>): void;
  // ! When using `alias`, potentially passed `deps` are ignored.
  <Id extends string>(id: Id, deps: string[], alias: Alias<string>): void;

  /**
   * Enables a fast-path for non-lazy dependency-less modules.
   *
   * @param name
   * @param defaultExport
   *
   * @example
   * ```ts
   * define.exports('foo/bar', 'the default export');
   *
   * define('foo/other', ['foo/bar'], function (bar) {
   *   console.log(bar.default); // => 'the default export'
   * });
   * ```
   *
   * @see Define
   * @see https://github.com/ember-cli/loader.js#defineexportsfoo-
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L245-L262
   */
  exports<Id extends string, DefaultExport extends {}>(
    name: Id,
    defaultExport: DefaultExport
  ): Merge<
    Module<Id, DefaultExport, []>,
    {
      state: 'finalized';

      // Yes, this is really `null`. ¯\_(ツ)_/¯
      // https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L255
      pending: null;
    }
  >;

  /**
   * Allows the creation of a symlink from one module to another. Supports two
   * invocation styles.
   *
   * @example Two module names: The second one links to the first one.
   * ```ts
   * // `random` is computed once on first lookup and then cached.
   * define('random', () => Math.random());
   *
   * // Creates `some/other/name'`, so that it links to `random`.
   * define.alias('random', 'some/other/name');
   *
   * // Resolves as `random`.
   * require('some/other/name') // => 0.123456789;
   *
   * // Identity is the same.
   * require('random') === require('some/other/name');
   * ```
   *
   * @example Single module name: An `Alias` is returned that can be passed to
   *`define(id, alias)` invocations in place of `callback`.
   * ```ts
   * // `random` is computed once on first lookup and then cached.
   * define('random', () => Math.random());
   *
   * // Creates `some/other/name'`, so that it links to `random`.
   * define('some/other/name', define.alias('random'));
   *
   * // Resolves as `random`.
   * require('some/other/name') // => 0.123456789;
   *
   * // Identity is the same.
   * require('random') === require('some/other/name');
   * ```
   *
   * @see https://github.com/ember-cli/loader.js#definealiasoldpath-new-name
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L272-L278
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L288-L290
   */
  alias<Id extends string>(id: Id): Alias<Id>;
  alias<Id extends string>(id: Id, from: string): void;
  alias<Id extends string>(id: Id, from?: string): Alias<Id> | void;
}

/**
 * A registry of all modules that have been registered so far, no matter
 * what `ModuleState` they are in, .e.g. also modules that haven't been
 * reified yet are included in this registry.
 *
 * @note Lazily loaded / executed / registered modules, .e.g when using
 * lazy-loading Engines are _not_ known ahead of time. They are only
 * registered, when the addition bundle is loaded and executed. However once
 * registered, they behave just the same.
 *
 * @remarks Do not manipulate this registry directly! Treat it as readonly and
 * only use the public API to change it:
 * - Adding modules:
 *   - `define(id, deps?, callback)`
 *   - `define.alias(id, target?)`
 *   - `define.exports(id, exports)`
 * - Removing modules (treat with caution!):
 *   - `require.unsee(id)`
 *
 * @see Define
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L331
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L79
 */
export type ModuleEntries = Record<string, Module<string, Exports, string[]>>;

/**
 * Allows you to dynamically require a module as well as interrogate and
 * manipulate the module registry.
 * Exposed as `require` global and aliased by the `requireModule` and
 * `requirejs` globals.
 *
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L46-L58
 */
export interface Require extends Pick<InternalHelpers, 'has'> {
  /**
   * Returns the exports from the `Module` identified by `id`.
   *
   * @throws If no module is registered as `id`.
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L46-L58
   */
  (id: string): unknown;

  /**
   * @deprecated Use `entries` instead.
   * @see Require#entries
   */
  readonly _eak_seen: Require['entries'];

  /**
   * A registry of all modules that have been registered so far, no matter
   * what `ModuleState` they are in, .e.g. also modules that haven't been
   * reified yet are included in this registry.
   *
   * @note Lazily loaded / executed / registered modules, .e.g when using
   * lazy-loading Engines are _not_ known ahead of time. They are only
   * registered, when the addition bundle is loaded and executed. However once
   * registered, they behave just the same.
   *
   * @remarks Do not manipulate this registry directly! Treat it as readonly and
   * only use the public API to change it:
   * - Adding modules:
   *   - `define(id, deps?, callback)`
   *   - `define.alias(id, target?)`
   *   - `define.exports(id, exports)`
   * - Removing modules (treat with caution!):
   *   - `require.unsee(id)`
   *
   * @see Define
   * @see ModuleEntries
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L331
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L79
   */
  readonly entries: Readonly<ModuleEntries>;

  /**
   * @inheritDoc
   * @see InternalHelpers#has
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L332
   */
  has(dep: string): boolean;

  /**
   * Shorthand method for removing a module from the registry and pretending it
   * never was registered.
   *
   * @see Module#unsee
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L333-L335
   */
  unsee(id: string): void;

  /**
   * Clears the complete registry.
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L337-L340
   */
  clear(): void;
}

/**
 * A local form of `require(id)` exposed when you list `require` as a dependency
 * of your module. It can be used for dynamic imports relative to the module and
 * reflection.
 *
 * @see https://github.com/ember-cli/loader.js#requirerequire
 * @see LocalRequire#()
 * @see Module#makeRequire
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L193-L195
 * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L203-L214
 */
export interface LocalRequire<Id extends string, TExports extends Exports>
  extends Pick<InternalHelpers, 'has'> {
  /**
   * You can list `require` as a dependency of your modules.
   * This provides a `require` scoped to the current module, enabling dynamic,
   * relative path imports. The path resolution works just like with `deps`
   * specified in `define(id, deps, callback)`.
   *
   * @example
   * ```ts
   * define.exports('foo',         '🔷 foo');
   * define.exports('foo/bar',     '🔷 foo → 🔸 bar');
   * define.exports('foo/foo',     '🔷 foo → 🔹 foo');
   * define.exports('foo/hamster', '🔷 foo → 🐹 hamster');
   *
   * define.exports('bar',         '🔶 bar');
   * define.exports('bar/bar',     '🔶 bar → 🔸 bar');
   * define.exports('bar/foo',     '🔶 bar → 🔹 foo');
   * define.exports('bar/unicorn', '🔶 bar → 🦄  unicorn');
   *
   * define('foo/example', ['require'], function (require) {
   *   // Relative & absolute imports.
   *   console.log(require('bar'));     // => '🔶 bar'
   *   console.log(require('./bar'));   // => '🔷 foo → 🔸 bar'
   *   console.log(require('../bar'));  // => '🔶 bar'
   *
   *   console.log(require('foo'));     // => '🔷 foo'
   *   console.log(require('./foo'));   // => '🔷 foo → 🔹 foo'
   *   console.log(require('../foo'));  // => '🔷 foo'
   *
   *   console.log(require('foo/bar')); // => '🔷 foo → 🔸 bar'
   *   console.log(require('foo/foo')); // => '🔷 foo → 🔹 foo'
   *
   *   console.log(require('bar/bar')); // => '🔶 bar → 🔸 bar'
   *   console.log(require('bar/foo')); // => '🔶 bar → 🔹 foo'
   *
   *   console.log(require('foo/hamster'));    // => '🔷 foo → 🐹 hamster'
   *   console.log(require('./hamster'));      // => '🔷 foo → 🐹 hamster'
   *
   *   console.log(require('bar/unicorn'));    // => '🔶 bar → 🦄  unicorn'
   *   console.log(require('../bar/unicorn')); // => '🔶 bar → 🦄  unicorn'
   *
   *   // `has` follows the same relative rules.
   *   console.log(require.has('foo/hamster')); // => ✅ true
   *   console.log(require.has('./hamster'));   // => ✅ true
   *   console.log(require.has('hamster'));     // => ❌ false, no root module
   *
   *   console.log(require.has('bar/unicorn')); // => ✅ true
   *   console.log(require.has('./unicorn'));   // => ❌ false, not in `foo`
   *   console.log(require.has('unicorn'));     // => ❌ false, no root module
   *
   *   // The own module ID of the module that listed `require` as a dependency,
   *   // so i.e. _this_ module.
   *   console.log(require.moduleId); // => 'foo/example'
   * });
   * ```
   *
   * @see https://github.com/ember-cli/loader.js#requirerequire
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L205-L207
   */
  (dep: string): TExports;

  /**
   * A reference to the `require` itself for AMD module compatibility, as they
   * expect `default` to be the default export instead of the object itself to
   * be the default export.
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L208
   */
  readonly default: LocalRequire<Id, TExports>;

  /**
   * The ID of the module that listed this local `require` as a dependency.
   *
   * @example
   * ```ts
   * define('my/name/is', ['require'], function(require) {
   *   console.log(require.moduleId); // => 'my/name/is'
   * });
   * ```
   *
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L209
   */
  readonly moduleId: Id;

  /**
   * @inheritDoc
   * @see InternalHelpers#has
   * @see https://github.com/ember-cli/loader.js#requirerequire
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L210-L212
   */
  has(dep: string): boolean;
}
