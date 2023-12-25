import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string, exec:any   }} options
 */
export const stageAll = async ({ cwd, gitPath, exec }) => {
  try {
    const args = ['add', '.']
    const gitResult = await exec({
      args,
      name: 'stageAll',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'stageAll')
  }
}
