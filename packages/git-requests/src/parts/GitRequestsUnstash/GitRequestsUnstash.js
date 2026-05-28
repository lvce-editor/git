import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any, stashReference?: string }} options
 */
export const unstash = async ({ cwd, gitPath, exec, stashReference = '' }) => {
  try {
    const args = ['stash', 'pop']
    if (stashReference) {
      args.push(stashReference)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'unstash',
    })
  } catch (error) {
    throw new GitError(error, 'unstash')
  }
}
