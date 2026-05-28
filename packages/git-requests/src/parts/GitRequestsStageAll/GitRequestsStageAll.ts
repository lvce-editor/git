import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string, exec:any   }} options
 */
export const stageAll = async ({ cwd, exec, gitPath }) => {
  try {
    const args = ['add', '.']
    const gitResult = await exec({
      args,
      cwd,
      gitPath,
      name: 'stageAll',
    })
  } catch (error) {
    throw new GitError(error, 'stageAll')
  }
}
