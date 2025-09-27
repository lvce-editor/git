import * as ExitCode from '../../ExitCode/ExitCode.js'
import { GitRepository } from '../../GitRepository/GitRepository.js'
import type { CommandOptions } from '../../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../../CommandResult/CommandResult.js'

export const handleBranch = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const branches = await repository.listBranches()
  
  return {
    stdout: branches.map(b => `* ${b}`).join('\n'),
    stderr: '',
    exitCode: ExitCode.Success
  }
}
