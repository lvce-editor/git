import * as Character from '../Character/Character.js'

export const getFirstLine = (string) => {
  const newLineIndex = string.indexOf(Character.Newline)
  if (newLineIndex === -1) {
    return Character.EmptyString
  }
  return string.slice(0, newLineIndex)
}
