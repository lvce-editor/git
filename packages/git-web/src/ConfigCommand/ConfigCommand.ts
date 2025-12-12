import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'

export const handleConfig = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const result = await repository.handleConfig(args)

  return {
    exitCode: ExitCode.Success,
    stderr: '',
    stdout: result,
  }
}

export const handleCheckIgnore = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  return {
    exitCode: ExitCode.Success,
    stderr: '',
    stdout: '',
  }
}
