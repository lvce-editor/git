import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'
import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'

export const handleRemote = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const result = await repository.handleRemote(args)

  return {
    stdout: result,
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
