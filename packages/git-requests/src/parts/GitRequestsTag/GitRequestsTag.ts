import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath: string,  tag: string, exec:any }} options
 */
export const tag = async ({ cwd, gitPath, tag, exec }) => {
  try {
    const gitResult = await exec({
      args: ['tag', tag],
      cwd,
      gitPath,
      name: 'tag',
    })
  } catch (error) {
    throw new GitError(error, 'tag')
  }
}
