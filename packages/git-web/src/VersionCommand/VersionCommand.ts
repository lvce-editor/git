import * as ExitCode from '../ExitCode/ExitCode.ts'
import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'

export const handleVersion = async (): Promise<CommandResult> => {
  return {
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
