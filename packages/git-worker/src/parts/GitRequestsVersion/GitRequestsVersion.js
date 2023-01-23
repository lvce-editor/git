import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const version = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['--version'],
      cwd,
      gitPath,
      name: 'version',
    })
    const stdout = gitResult.stdout
    if (!stdout.startsWith('git version ')) {
      throw new vscode.VError('failed to parse git version')
    }
    return stdout.slice('git version '.length)
  } catch (error) {
    throw new GitError(error, 'version')
  }
}
