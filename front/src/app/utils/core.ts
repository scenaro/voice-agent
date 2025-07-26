// Important! This is the core,
// this file MUST be not coupled to any other dependency in the project.
// This allow to import the core in any other file in the project.

import Evemit from 'evemit';
import { NODE_ENV, APP_ENV } from 'astro:env/client';

const isDevEnv = NODE_ENV === 'development';
const isProdEnv = NODE_ENV === 'production';
const isTestEnv = APP_ENV === 'test'

type CoreType = {
  [key: string]: Evemit[keyof Evemit] | any;
};

/**
 * Framework core.
 *
 * Object container for the core utilities.
 */
const __: CoreType = {};
// function __() {
//   return (__ as any).t(...arguments);
// }

let ee: null | Evemit = new Evemit();

for (let k in ee) {
  __[k] = ee[k as keyof Evemit];
}

// free memory
ee = null;
console.log('env', NODE_ENV)
// Execution environment
__.NODE_ENV = NODE_ENV;
__.APP_ENV = APP_ENV;
__.isDev = isDevEnv;
__.isProd = isProdEnv;
__.isTest = isTestEnv;

export default __ as any;