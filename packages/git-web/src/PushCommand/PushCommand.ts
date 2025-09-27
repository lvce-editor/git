import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'
import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'

export const handlePush = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  await repository.push(args)

  return {
    stdout: 'Everything up-to-date',
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
