import * as ParseGitStatusLine from '../ParseGitStatusLine/ParseGitStatusLine.js'

/**
 *
 * @param {string[]} lines
 * @returns
 */
export const parseGitStatus = (lines) => {
  /**
   * @type{any[]}
   */
  const index = []
  for (const line of lines) {
    ParseGitStatusLine.parseGitStatusLine(index, line)
  }
  return index
}
