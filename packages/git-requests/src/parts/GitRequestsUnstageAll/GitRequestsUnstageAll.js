import { GitError } from '../GitError/GitError.js'

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
    if (error && error instanceof Error && error.message.includes(`fatal: pathspec '.' did not match any files`)) {
      return
    }
    throw new GitError(error, 'unstageAll')
  }
}
