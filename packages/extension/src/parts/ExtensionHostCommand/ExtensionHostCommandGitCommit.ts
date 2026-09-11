import * as CommandId from '../CommandId/CommandId.ts'
import * as Commit from '../Commit/Commit.ts'

export const id = CommandId.GitCommit

export const execute = async (message: string | undefined): Promise<void> => {
  await Commit.commit(message)
}
