import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'
import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'

export const handleDiff = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const diff = await repository.getDiff(args)

  return {
    stdout: diff,
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
