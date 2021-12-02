import { getGlobals } from './get-globals';

/**
 * Correctly typed convenience re-exports of the `loader.js` globals.
 *
 * @remarks Intentionally not exporting `requirejs` & `requireModule` as they
 * are just aliases of `require` and would cause confusion.
 */
export const { loader, define, require } = getGlobals(window as any);
