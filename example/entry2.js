import isString from './common/is-string';

import { key1, key2, is } from './common/inner';

console.log(`${key1} ${is(isString(key1))} String.`);
console.log(`${key2} ${is(isString(key2))} String.`);
