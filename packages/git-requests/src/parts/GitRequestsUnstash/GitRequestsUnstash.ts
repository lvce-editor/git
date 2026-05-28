import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any, stashReference?: string }} options
 */
export const unstash = async ({ cwd, exec, gitPath, stashReference = '' }) => {
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
