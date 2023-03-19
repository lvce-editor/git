import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequestsAdd from '../GitRequestsAdd/GitRequestsAdd.js'

/**
 * @param {string} file
 */
export const execute = async (file) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'add',
    fn: GitRequestsAdd.add,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      file,
    },
  })
}
