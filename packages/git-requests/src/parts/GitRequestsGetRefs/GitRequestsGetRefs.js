import { GitError } from '../GitError/GitError.js'
import * as ParseGitRefs from '../ParseGitRefs/ParseGitRefs.js'

/**
 *
 * @param {{cwd: string, gitPath: string, exec:any }} options
 */
export const getRefs = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['for-each-ref', '--format', '%(refname) %(objectname) %(*objectname)'],
      cwd,
      gitPath,
      name: 'init',
    })
    return ParseGitRefs.parseGitRefs(gitResult.stdout)
  } catch (error) {
    throw new GitError(error, 'getRefs')
  }
}
