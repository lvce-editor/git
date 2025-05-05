import { GitError } from '../GitError/GitError.js'
import { unstageFallback } from '../GitRequestsUnstageFallback/GitRequestsUnstageFallback.js'
import { isEmptyGitRepositoryError } from '../IsEmptyRepositoryError/IsEmptyRepositoryError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const unstage = async ({ cwd, gitPath, file, exec }) => {
  try {
    const args = ['restore', '--staged', '--', file]
    const gitResult = await exec({
      args,
      name: 'unstage',
      cwd,
      gitPath,
    })
  } catch (error) {
    if (isEmptyGitRepositoryError(error)) {
      await unstageFallback({
        cwd,
        gitPath,
        exec,
        file,
      })
      return
    }
    throw new GitError(error, 'unstage')
  }
}
