import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any, key:string, value:string }} options
 */
export const setConfig = async ({ cwd, exec, gitPath, key, value }) => {
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
