import * as CommandId from '../CommandId/CommandId.ts'
import * as Commit from '../Commit/Commit.ts'

export const id = CommandId.GitAcceptInput

export const execute = async (message) => {
  return Commit.commit(message, { all: true, postCommitCommand: 'sync' })
}
