import * as Assert from '../Assert/Assert.ts'
import * as Rpc from '../Rpc/Rpc.ts'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = async (command, args, options) => {
  Assert.string(command)
  Assert.array(args)
  Assert.object(options)
  return Rpc.invoke('Exec.exec', command, args, options)
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
