import type { GitErrorLike, GitRequestContext, GitStatusResult } from '../Types/Types.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { GitError } from '../GitError/GitError.ts'
import * as ParseGitStatus from '../ParseGitStatus/ParseGitStatus.ts'

export const getModifiedFiles = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<GitStatusResult> => {
  let gitResult
  try {
    gitResult = await exec({
      args: ['status', '--porcelain', '-uall'],
      cwd,
      gitPath,
      name: 'getModifiedFiles',
    })
  } catch (error) {
    if ((error as GitErrorLike | undefined)?.code === ErrorCodes.ENOENT) {
      return {
        count: 0,
        gitRoot: cwd, // TODO
        index: [],
      }
    }
    throw new GitError(error, 'getModifiedFiles')
  }
  const lines = gitResult.stdout === '' ? [] : gitResult.stdout.split('\n')
  const index = ParseGitStatus.parseGitStatus(lines)
  const count = index.length
  return {
    count,
    gitRoot: cwd, // TODO
    index,
  }
}
