import { GitError } from '../GitError/GitError.js'
import * as ParseGitCommits from '../ParseGitCommits/ParseGitCommits.js'

/**
 * @param {{cwd: string, gitPath: string, exec:any }} options
 */
export const getCommits = async ({ cwd, gitPath, exec }) => {
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
