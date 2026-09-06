import * as CommandId from '../CommandId/CommandId.ts'
import * as Commit from '../Commit/Commit.ts'

export const id = CommandId.GitAcceptInput

export const execute = async (message) => {
  return Commit.commit(message, { all: true })
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
