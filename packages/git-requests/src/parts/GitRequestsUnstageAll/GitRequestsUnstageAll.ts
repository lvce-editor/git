import { GitError } from '../GitError/GitError.ts'
import { unstageAllFallback } from '../GitRequestsUnstageAllFallback/GitRequestsUnstageAllFallback.ts'
import { isDidNotMatchAnyFilesError } from '../IsDidNotMatchAnyFilesError/IsDidNotMatchAnyFilesError.ts'
import { isEmptyGitRepositoryError } from '../IsEmptyRepositoryError/IsEmptyRepositoryError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string, exec:any }} options
 */
export const unstageAll = async ({ cwd, exec, gitPath }) => {
  try {
    const args = ['restore', '--staged', '.']
    const gitResult = await exec({
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
