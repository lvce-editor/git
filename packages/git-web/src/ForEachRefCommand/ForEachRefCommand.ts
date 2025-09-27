import * as ExitCode from '../ExitCode/ExitCode.js'
import { GitRepository } from '../GitRepository/GitRepository.js'
import type { CommandOptions } from '../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../CommandResult/CommandResult.js'

export const handleForEachRef = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const refs = await repository.listRefs(args)

  return {
    stdout: refs.join('\n'),
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
