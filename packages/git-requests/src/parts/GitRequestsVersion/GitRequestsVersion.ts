import { GitError } from '../GitError/GitError.ts'
import type { GitRequestContext } from '../Types/Types.ts'

export const version = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<string> => {
  try {
    const gitResult = await exec({
      args: ['--version'],
      cwd,
      gitPath,
      name: 'version',
    })
    const { stdout } = gitResult
    if (!stdout.startsWith('git version ')) {
      throw new Error('failed to parse git version')
    }
    return stdout.slice('git version '.length)
  } catch (error) {
    throw new GitError(error, 'version')
  }
}
