import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string,gitPath:string, file:string, exec:any, confirm:any }} options
 */
export const discard = async ({ cwd, gitPath, file, exec, confirm }) => {
  try {
    const confirmResult = await confirm({
      message: `Are you sure you want to discard ${file}`,
    })
    if (!confirmResult) {
      return
    }
    const gitResult = await exec({
      args: ['restore', '--', file],
      cwd,
      gitPath,
      name: 'discard',
    })
  } catch (error) {
    throw new GitError(error, 'discard')
  }
}
