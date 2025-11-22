import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any, uris:any  }} options
 */
export const getDecorations = async ({ cwd, gitPath, uris, exec }) => {
  try {
    const gitResult = await exec({
      args: ['check-ignore', '-v', '-z', '--stdin'],
      name: 'decorations',
      cwd,
      gitPath,
    })
    return gitResult
  } catch (error) {
    throw new GitError(error, 'decorations')
  }
}
