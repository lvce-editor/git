import * as ExitCode from '../ExitCode/ExitCode.js'
import { GitRepository } from '../GitRepository/GitRepository.js'
import type { CommandOptions } from '../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../CommandResult/CommandResult.js'

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
