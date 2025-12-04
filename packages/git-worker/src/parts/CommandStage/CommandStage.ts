import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

/**
 * @param {string} file
 */
export const commandStage = async (file) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      file,
      gitPath: repository.gitPath,
    },
    fn: GitRequests.stage,
    id: 'stage',
  })
}
