import { getGlobals } from './get-globals';

/**
 * Correctly typed convenience re-exports of the `loader.js` globals.
 *
 * @remarks Intentionally not exporting `requirejs` & `requireModule` as they
 * are just aliases of `require` and would cause confusion.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { loader, define, require } = getGlobals(window as any);
