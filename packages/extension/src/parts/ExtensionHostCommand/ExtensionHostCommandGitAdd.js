import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'
import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitAdd

/**
 * @param {string} file
 */
export const execute = async (file) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'add',
    fn: GitRequests.add,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      file,
    },
  })
}
