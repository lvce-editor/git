import type { GitCommit, GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'
import * as ParseGitCommits from '../ParseGitCommits/ParseGitCommits.ts'

export const getCommits = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<readonly GitCommit[]> => {
  try {
    const gitResult = await exec({
      args: ['log', '--format=%H%x09%s'],
      cwd,
      gitPath,
      name: 'getCommits',
    })
    return ParseGitCommits.parseGitCommits(gitResult.stdout)
  } catch (error) {
    throw new GitError(error, 'getCommits')
  }
}
