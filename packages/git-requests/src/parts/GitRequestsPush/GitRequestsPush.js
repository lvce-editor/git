import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any, setUpstream?: readonly string[] }} options
 */
export const push = async ({ cwd, gitPath, exec, setUpstream = undefined }) => {
  try {
    const args = ['push', '--porcelain']
    if (setUpstream && setUpstream.length > 0) {
      args.push('--set-upstream', ...setUpstream)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'push',
    })
    console.log('finished')
  } catch (error) {
    throw new GitError(error, 'push')
  }
}
