import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string, gitPath:string, exec:any  }} options
 */
export const addAll = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['add', '.'],
      cwd,
      gitPath,
      name: 'addAll',
    })
  } catch (error) {
    throw new GitError(error, 'addAll')
  }
}
