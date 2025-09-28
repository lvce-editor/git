import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'

export const handleStatus = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)

  // Parse arguments
  const porcelain = args.includes('--porcelain')
  const untrackedAll = args.includes('-uall') || args.includes('--untracked-files=all')

  const status = await repository.getStatus(porcelain, untrackedAll)

  return {
    stdout: status,
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
