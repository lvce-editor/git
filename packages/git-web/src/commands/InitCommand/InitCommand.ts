import * as ExitCode from '../../ExitCode/ExitCode.js'
import type { CommandOptions } from '../../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../../CommandResult/CommandResult.js'

export const handleInit = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  return {
    stdout: 'Initialized empty Git repository in .git/',
    stderr: '',
    exitCode: ExitCode.Success
  }
}
