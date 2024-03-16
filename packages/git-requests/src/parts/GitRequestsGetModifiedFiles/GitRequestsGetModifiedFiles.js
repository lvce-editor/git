import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import { GitError } from '../GitError/GitError.js'
import * as ParseGitStatus from '../ParseGitStatus/ParseGitStatus.js'

/**
 * @param {{cwd:string, gitPath:string, exec:any }} options
 */
export const getModifiedFiles = async ({ cwd, gitPath, exec }) => {
  let gitResult
  try {
    gitResult = await exec({
      args: ['status', '--porcelain', '-uall'],
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
  const index = ParseGitStatus.parseGitStatus(lines)
  const count = index.length
  return {
    index,
    gitRoot: cwd, // TODO
    count,
  }
}
