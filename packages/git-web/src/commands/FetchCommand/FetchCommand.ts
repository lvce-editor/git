import * as ExitCode from '../../ExitCode/ExitCode.js'
import { GitRepository } from '../../GitRepository/GitRepository.js'
import type { CommandOptions } from '../../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../../CommandResult/CommandResult.js'

export const handleFetch = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  await repository.fetch(args)
  
  return {
    stdout: 'From https://github.com/user/repo\n * branch            main       -> FETCH_HEAD',
    stderr: '',
    exitCode: ExitCode.Success
  }
}
