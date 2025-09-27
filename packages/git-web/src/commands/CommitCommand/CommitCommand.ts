import * as ExitCode from '../../ExitCode/ExitCode.js'
import { GitRepository } from '../../GitRepository/GitRepository.js'
import type { CommandOptions } from '../../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../../CommandResult/CommandResult.js'

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
    stdout: `[main ${commitHash}] ${message}`,
    stderr: '',
    exitCode: ExitCode.Success
  }
}
