import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{uri:string, repositoryPath:string, gitPath:string, exec:any}} options
 */
export const getFileBefore = async ({ uri, repositoryPath, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['show', `HEAD:${uri}`],
      cwd: repositoryPath,
      gitPath,
      name: 'getFileBefore',
    })
    return gitResult.stdout
  } catch (error) {
    // @ts-ignore
    if (error && error.stderr === `fatal: invalid object name 'HEAD'.`) {
      return ''
    }
    throw new GitError(error, 'getFileBefore')
  }
}
