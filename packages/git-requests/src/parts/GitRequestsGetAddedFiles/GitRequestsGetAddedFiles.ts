import { GitError } from '../GitError/GitError.ts'

/**
 * @param {{cwd:string, gitPath:string, exec:any  }} options
 */
export const getAddedFiles = async ({ cwd, exec, gitPath }) => {
  try {
    const gitResult = await exec({
      args: ['diff', '--name-only', '--cached'],
      cwd,
      gitPath,
      name: 'getAddedFiles',
    })
  } catch (error) {
    throw new GitError(error, 'getAddedFiles')
  }
}
