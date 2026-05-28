import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitAcceptInput

export const execute = async (message) => {
  return GitWorker.invoke('Command.gitAcceptInput', message)
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
