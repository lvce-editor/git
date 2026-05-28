import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any, name:string, url:string }} options
 */
export const addRemote = async ({ cwd, exec, gitPath, name, url }) => {
  try {
    await exec({
      args: ['remote', 'add', name, url],
      cwd,
      gitPath,
      name: 'addRemote',
    })
  } catch (error) {
    throw new GitError(error, 'addRemote')
  }
}
