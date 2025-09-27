/**
 * Join path segments with forward slashes
 * @param {...string} segments - Path segments to join
 * @returns {string} Joined path
 */
export const join = (start: string, ...rest: readonly string[]): string => {
  return `${start}${rest.join('/')}`
}
