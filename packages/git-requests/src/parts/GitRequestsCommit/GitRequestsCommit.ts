import { GitError } from '../GitError/GitError.ts'

/**
 * @param {{cwd:string, gitPath:string, message:string, exec:any}} options
 */
export const commit = async ({ cwd, gitPath, message, exec }) => {
  try {
    const gitResult = await exec({
      args: ['commit', '-m', message],
      cwd,
      gitPath,
      name: 'commit',
    })
  } catch (error) {
    throw new GitError(error, 'commit')
  }
}
