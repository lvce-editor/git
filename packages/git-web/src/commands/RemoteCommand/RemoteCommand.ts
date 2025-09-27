import * as ExitCode from '../../ExitCode/ExitCode.js'
import { GitRepository } from '../../GitRepository/GitRepository.js'
import type { CommandOptions } from '../../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../../CommandResult/CommandResult.js'

export const handleRemote = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const result = await repository.handleRemote(args)

  return {
    stdout: result,
    stderr: '',
    exitCode: ExitCode.Success
  }
}
