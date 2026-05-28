import { GitError } from '../GitError/GitError.ts'
import { unstageFallback } from '../GitRequestsUnstageFallback/GitRequestsUnstageFallback.ts'
import { isEmptyGitRepositoryError } from '../IsEmptyRepositoryError/IsEmptyRepositoryError.ts'
import type { GitFileRequest } from '../Types/Types.ts'

export const unstage = async ({ cwd, exec, file, gitPath }: GitFileRequest): Promise<void> => {
  try {
    const args = ['restore', '--staged', '--', file]
    await exec({
      args,
      cwd,
      gitPath,
      name: 'unstage',
    })
  } catch (error) {
    if (isEmptyGitRepositoryError(error)) {
      await unstageFallback({
        cwd,
        exec,
        file,
        gitPath,
      })
      return
    }
    throw new GitError(error, 'unstage')
  }
}
