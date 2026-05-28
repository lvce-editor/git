import type { GitKeyValueRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const setConfig = async ({ cwd, exec, gitPath, key, value }: GitKeyValueRequest): Promise<void> => {
  try {
    await exec({
      args: ['config', key, value],
      cwd,
      gitPath,
      name: 'setConfig',
    })
  } catch (error) {
    throw new GitError(error, 'setConfig')
  }
}
