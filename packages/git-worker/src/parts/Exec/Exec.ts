import * as Assert from '../Assert/Assert.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { getWorkspaceUris } from '../WorkspaceUris/WorkspaceUris.ts'

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
  const actualOptions = typeof options.cwd === 'string' ? { ...options, cwd: getWorkspaceUris(options.cwd).remoteWorkspaceUri } : options
  return Rpc.invoke('Exec.exec', command, args, actualOptions)
}

export const isExecError = (error: unknown): error is { stderr: string } => {
  return error !== null && typeof error === 'object' && 'stderr' in error
}
