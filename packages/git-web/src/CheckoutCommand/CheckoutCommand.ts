import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'
import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'

export const handleCheckout = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const branch = args[0] || 'main'
  await repository.checkout(branch)

  return {
    stdout: `Switched to branch '${branch}'`,
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
