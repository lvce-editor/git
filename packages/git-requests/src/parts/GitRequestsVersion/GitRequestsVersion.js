import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any}} options
 */
export const version = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['--version'],
      cwd,
      gitPath,
      name: 'version',
    })
    const stdout = gitResult.stdout
    if (!stdout.startsWith('git version ')) {
      throw new Error('failed to parse git version')
    }
    return stdout.slice('git version '.length)
  } catch (error) {
    throw new GitError(error, 'version')
  }
}
