import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'

/**
 *
 * @param {string} uri
 */
export const getFileBefore = async (uri) => {
  try {
    const repository = await Repositories.getCurrent()
    const gitResult = await Git.exec({
      args: ['show', `HEAD:${uri}`],
      cwd: repository.path,
      gitPath: repository.gitPath,
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
