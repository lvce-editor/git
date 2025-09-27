import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'

export const handleVersion = async (): Promise<CommandResult> => ({
  stdout: 'git version 2.34.1 (web-emulated)',
  stderr: '',
  exitCode: ExitCode.Success,
})
