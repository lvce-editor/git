import * as ExitCode from '../ExitCode/ExitCode.js'
import type { CommandOptions } from '../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../CommandResult/CommandResult.js'

export const handleVersion = async (): Promise<CommandResult> => {
  return {
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
