import * as ExitCode from '../../ExitCode/ExitCode.js'
import { GitRepository } from '../../GitRepository/GitRepository.js'
import type { CommandOptions } from '../../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../../CommandResult/CommandResult.js'

export const handlePull = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  await repository.pull(args)
  
  return {
    stdout: 'Already up to date.',
    stderr: '',
    exitCode: ExitCode.Success
  }
}
