import { GitError } from '../GitError/GitError.ts'
import { unstageAllFallback } from '../GitRequestsUnstageAllFallback/GitRequestsUnstageAllFallback.ts'
import { isDidNotMatchAnyFilesError } from '../IsDidNotMatchAnyFilesError/IsDidNotMatchAnyFilesError.ts'
import { isEmptyGitRepositoryError } from '../IsEmptyRepositoryError/IsEmptyRepositoryError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string, exec:any }} options
 */
export const unstageAll = async ({ cwd, gitPath, exec }) => {
  try {
    const args = ['restore', '--staged', '.']
    const gitResult = await exec({
      args,
      name: 'unstageAll',
      cwd,
      gitPath,
    })
  } catch (error) {
    if (isDidNotMatchAnyFilesError(error)) {
      return
    }
    if (isEmptyGitRepositoryError(error)) {
      await unstageAllFallback({
        cwd,
        gitPath,
        exec,
      })
      return
    }
    throw new GitError(error, 'unstageAll')
  }
}
