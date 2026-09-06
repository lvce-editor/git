import * as CommandId from '../CommandId/CommandId.ts'
import * as Commit from '../Commit/Commit.ts'

export const id = CommandId.GitCommitAndSync

export const execute = async (message: string): Promise<void> => {
  await Commit.commit(message, { postCommitCommand: 'sync' })
}
