import { GitError } from '../GitError/GitError.ts'
import { unstageAllFallback } from '../GitRequestsUnstageAllFallback/GitRequestsUnstageAllFallback.ts'
import { isDidNotMatchAnyFilesError } from '../IsDidNotMatchAnyFilesError/IsDidNotMatchAnyFilesError.ts'
import { isEmptyGitRepositoryError } from '../IsEmptyRepositoryError/IsEmptyRepositoryError.ts'
import type { GitRequestContext } from '../Types/Types.ts'

export const unstageAll = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    const args = ['restore', '--staged', '.']
    await exec({
      args,
      cwd,
      gitPath,
      name: 'unstageAll',
    })
  } catch (error) {
    if (isDidNotMatchAnyFilesError(error)) {
      return
    }
    if (isEmptyGitRepositoryError(error)) {
      await unstageAllFallback({
        cwd,
        exec,
        gitPath,
      })
      return
    }
    throw new GitError(error, 'unstageAll')
  }
}
