import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'
import * as Git from '../Git/Git.js'

/**
 * @param {string} file
 */
export const commandUnstage = async (file) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'unstageAll',
    fn: GitRequests.unstageAll,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      exec: Git.exec,
    },
  })
}