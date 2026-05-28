import type { Options } from 'execa'
import * as Assert from '../Assert/Assert.ts'
import * as Rpc from '../Rpc/Rpc.ts'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = async (command: string, args: readonly string[], options: Readonly<Record<string, unknown>>): Promise<any> => {
  Assert.string(command)
  Assert.array(args)
  Assert.object(options)
  return Rpc.invoke('Exec.exec', command, args, options)
}

export const isExecError = (error: unknown): error is { stderr: string } => {
  return error !== null && typeof error === 'object' && 'stderr' in error
}
