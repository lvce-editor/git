import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'

const extractCommitMessage = (args: string[]): string => {
  const messageIndex = args.indexOf('-m')
  if (messageIndex !== -1 && messageIndex + 1 < args.length) {
    return args[messageIndex + 1]
  }

  return 'Web commit'
}

export const handleCommit = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const message = extractCommitMessage(args)
  const commitHash = await repository.commit(message)

  return {
    exitCode: ExitCode.Success,
    stderr: '',
    stdout: `[main ${commitHash}] ${message}`,
  }
}
