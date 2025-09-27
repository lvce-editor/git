import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import { ExecError } from '../ExecError/ExecError.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as GitCommands from '../GitCommands/GitCommands.ts'

export type ExecOptions = {
  readonly cwd: string
  readonly env?: Record<string, string>
  readonly reject?: boolean
}

export type ExecResult = {
  readonly stdout: string
  readonly stderr: string
  readonly exitCode: number
}

/**
 * Web-compatible git exec function that emulates git commands
 */
export const exec = async (gitPath: string, args: string[], options: ExecOptions): Promise<ExecResult> => {
  if (typeof gitPath !== 'string') {
    throw new TypeError(`gitPath must be of type string, was ${gitPath}`)
  }

  if (!Array.isArray(args)) {
    throw new TypeError(`args must be an array, was ${args}`)
  }

  if (typeof options !== 'object' || options === null) {
    throw new Error(`options must be an object, was ${options}`)
  }

  const { cwd } = options

  if (typeof cwd !== 'string') {
    // throw new TypeError(`cwd must be of type string, was ${cwd}`)
  }

  try {
    const commandOptions: CommandOptions = { cwd }
    const result = await GitCommands.executeCommand(args, commandOptions)

    if (result.exitCode !== ExitCode.Success) {
      throw new ExecError(result.stdout, result.stderr, result.exitCode)
    }

    return result
  } catch (error) {
    if (error instanceof ExecError) {
      throw error
    }

    throw new ExecError('', error instanceof Error ? error.message : String(error), 1)
  }
}
