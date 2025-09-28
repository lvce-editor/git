import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const handleStatus = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  try {
    // Execute git status command via RPC
    const result = await Rpc.invoke('Exec.exec', 'git', ['status', ...args], {
      cwd: options.cwd,
    })

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    }
  } catch (error) {
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
      exitCode: ExitCode.GeneralError,
    }
  }
}
