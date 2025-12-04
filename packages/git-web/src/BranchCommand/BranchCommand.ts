import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'

export const handleBranch = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const branches = await repository.listBranches()

  return {
    exitCode: ExitCode.Success,
    stderr: '',
    stdout: branches.map((b) => `* ${b}`).join('\n'),
  }
}
