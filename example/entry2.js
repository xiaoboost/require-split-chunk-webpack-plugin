import isString from 'is-string';

import { key1, key2, is } from './inner';

console.log(`${key1} ${is(isString(key1))} String.`);
console.log(`${key2} ${is(isString(key1))} String.`);
