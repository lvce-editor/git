/**
 * Join path segments with forward slashes
 * @param {...string} segments - Path segments to join
 * @returns {string} Joined path
 */
export const join = (...segments: string[]): string => {
  return segments
    .filter(segment => segment !== '')
    .join('/')
    .replaceAll(/\/+/g, '/') // Replace multiple slashes with single slash
}
