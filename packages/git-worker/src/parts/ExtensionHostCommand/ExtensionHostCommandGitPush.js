import * as GitRequests from '../GitRequests/GitRequests.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitPush

export const execute = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'push',
    fn: GitRequests.push,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
}

// export const resolveError = (error) => {
//   return {
//     type: 'error-dialog',
//     message: error.toString(),
//     options: ['close'],
//   }
// }
