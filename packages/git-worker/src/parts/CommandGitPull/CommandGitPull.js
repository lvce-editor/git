import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequestsPull from '../GitRequestsPull/GitRequestsPull.js'

export const execute = async () => {
  // TODO get current workspace from somewhere
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'pull',
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
    fn: GitRequestsPull.pull,
  })
  console.log('git pull successfull')
}
