import * as CommandId from '../CommandId/CommandId.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const id = CommandId.GitStageAll

/**
 * @param {string} file
 */
export const execute = async (file) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'stageAll',
    fn: GitRequests.stageAll,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
}
