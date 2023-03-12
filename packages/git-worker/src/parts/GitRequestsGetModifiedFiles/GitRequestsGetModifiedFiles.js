import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'
import * as ParseGitStatus from '../ParseGitStatus/ParseGitStatus.js'

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const getModifiedFiles = async ({ cwd, gitPath }) => {
  let gitResult
  try {
    gitResult = await Git.exec({
      args: ['status', '--porcelain'],
      cwd,
      gitPath,
      name: 'getModifiedFiles',
    })
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      return {
        index: [],
        gitRoot: cwd, // TODO
        count: 0,
      }
    }
    throw new GitError(error, 'getModifiedFiles')
  }
  const lines = gitResult.stdout === '' ? [] : gitResult.stdout.split('\n')
  const index = ParseGitStatus.parseLines(lines)
  const count = index.length
  return {
    index,
    gitRoot: cwd, // TODO
    count,
  }
}
