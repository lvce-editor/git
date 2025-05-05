import { GitError } from '../GitError/GitError.js'
import { unstageAllFallback } from '../GitRequestsUnstageAllFallback/GitRequestsUnstageAllFallback.js'
import { unstageFallback } from '../GitRequestsUnstageFallback/GitRequestsUnstageFallback.js'
import { isDidNotMatchAnyFilesError } from '../IsDidNotMatchAnyFilesError/IsDidNotMatchAnyFilesError.js'
import { isEmptyGitRepositoryError } from '../IsEmptyRepositoryError/IsEmptyRepositoryError.js'

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
