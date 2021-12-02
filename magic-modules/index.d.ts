import type { LocalRequire, Exports } from '../types';

export namespace MagicModules {
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
  export type require<
    Id extends string,
    TExports extends Exports
  > = LocalRequire<Id, TExports>;

  export const require: require<string, exports>;

  /**
   * You can set properties on this object for them to be exported, but you
   * can't replace the object itself. Use `module` for this.
   *
   * @see MagicModules#module
   * @see Module#module
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L190-L193
   */
  export type exports = Exports;

  export const exports: exports;

  /**
   * The `exports` wrapper from `Module#module`. You can set properties on
   * `exports` for them to be exported. You can also replace the `exports`
   * property with a different value, including primitive types, altogether.
   *
   * @remarks You can also attach further meta information to the wrapper
   * object, but it won't be used anywhere, nor be accessible via
   * `require(id)` calls. For more convenient access to such meta information
   * via the `Require#entries` registry, consider attaching it to the `Module`
   * itself instead, which is accessible as `this` inside the `ModuleCallback`.
   *
   * @see Module#module
   * @see https://github.com/ember-cli/loader.js/blob/v4.7.0/lib/loader/loader.js#L195-L197
   */
  export interface module {
    exports: exports;
  }

  export const module: module;
}

export interface MagicModules<Id extends string, TExports extends Exports> {
  require: MagicModules.require<Id, TExports>;
  exports: MagicModules.exports;
  modules: MagicModules.module;
}
