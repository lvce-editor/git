import { GitError } from '../GitError/GitError.js'

const isEmptyGitRepositoryError = (error) => {
  return error && error.stderr && error.stderr === 'fatal: could not resolve HEAD'
}

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
      const args = ['reset', '--', file]
      const gitResult = await exec({
        args,
        name: 'unstage',
        cwd,
        gitPath,
      })
      return
    }
    throw new GitError(error, 'unstage')
  }
}
