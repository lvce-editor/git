import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any, key:string, value:string }} options
 */
export const setConfig = async ({ cwd, gitPath, exec, key, value }) => {
  try {
    await exec({
      args: ['config', key, value],
      cwd,
      gitPath,
      name: 'setConfig',
    })
  } catch (error) {
    throw new GitError(error, 'setConfig')
  }
}
