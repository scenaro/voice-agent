/**
 * Ensure that the value (`val`) is a string.
 *
 * @param  {object|array|string}  val  A given value
 * passed to `JSON.stringify` if is not a string.
 *
 * @return {string}  JSON stringified value if `val` is an object
 * or the string value.
 */

export function toStr(val: any): string {
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}

/**
 * Ensure that the value (`val`) is an object (if it's intented to be an object).
 *
 * @param  {*}       val  A given value.
 * @return {*}  JSON parsed value if `val` is not an object or the object value.
 */

export function toObj(val: any): any {
  if (typeof val === 'object' || val === null || typeof val !== 'string') {
    return val;
  }

  val = val.trim();

  if (val === 'null' || val.length === 0) return null;
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (!isNaN(val)) return Number(val);
  if (val[0] === '[' || val[0] === '{') return JSON.parse(val);

  return val;
}