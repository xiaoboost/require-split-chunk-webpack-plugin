import isNumber from './common/is-number';

import { key1, key2, is } from './common/inner';

console.log(`${key1} ${is(isNumber(key1))} Number.`);
console.log(`${key2} ${is(isNumber(key2))} Number.`);
