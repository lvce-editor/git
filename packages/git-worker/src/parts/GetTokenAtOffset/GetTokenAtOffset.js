/**
 * @param {any[]} tokens
 * @param {number} offset
 * @returns {any}
 */
export const getTokenAtOffset = (tokens, offset) => {
  // TODO binary search
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.offset >= offset) {
      if (token.offset === offset) {
        return token
      }
      return tokens[i - 1]
    }
  }
  return tokens[tokens.length - 1]
}
