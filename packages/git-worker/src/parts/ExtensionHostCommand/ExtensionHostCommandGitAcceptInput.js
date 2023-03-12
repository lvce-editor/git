import * as GitRequests from '../GitRequests/GitRequests.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitAcceptInput

export const execute = async (message) => {
  const repository = await Repositories.getCurrent()
  await GitRequests.addAllAndCommit({
    message,
    cwd: repository.path,
    gitPath: repository.gitPath,
  })
}

export const resolveError = (error) => {
  console.log({ error: error.message })
  if (error && error.message.startsWith('Git: nothing to commit')) {
    return {
      type: 'info-dialog',
      message: 'There are no changes to commit',
      options: ['Create Empty Commit'],
    }
  }
  return {
    type: 'error-dialog',
    message: error.toString(),
    options: [],
  }
}
