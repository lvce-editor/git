import { GitError } from '../GitError/GitError.ts'
import { unstageFallback } from '../GitRequestsUnstageFallback/GitRequestsUnstageFallback.ts'
import { isEmptyGitRepositoryError } from '../IsEmptyRepositoryError/IsEmptyRepositoryError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const unstage = async ({ cwd, exec, file, gitPath }) => {
  try {
    const args = ['restore', '--staged', '--', file]
    const gitResult = await exec({
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
