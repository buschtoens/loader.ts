/**
 * `loader.js` is a "minimal AMD loader mostly stolen from @wycats". `ember-cli`
 * transpiles the project module source files and wraps them with `define(...)`
 * calls from `loader.js`, so that they can be bundled into a single file.
 *
 * @see https://github.com/ember-cli/loader.js
 *
 * Normally this happens in a completely transparent manner behind the scenes,
 * so that to users it appears just like their using regular ES6 modules. But
 * `loader.js` also exposes some more functionality, e.g. to dynamically
 * register (or replace) virtual modules at run time and interrogate the module
 * registry, which allows for powerful metaprogramming techniques.
 *
 * As this functionality is injected into the global scope, using it is
 * inherently unsafe and not type-safe. This modules provides exhaustive type
 * definitions and re-exposes the globals as exports for convenient access.
 *
 * @note Direct usage of `loader.js` is strongly discouraged unless expressly
 * necessary, as it is an implementation detail of the build system and
 * `ember-resolver`. For instance, while `embroider` currently still
 * inter-operates with `loader.js` for background compatibility, some internal
 * modules may not necessarily be registered in the `loader.js` registry.
 */

export * from './types';
export * from './get-globals';
