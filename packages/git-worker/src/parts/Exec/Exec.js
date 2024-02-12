import * as Rpc from '../Rpc/Rpc.js'
import * as Assert from '../Assert/Assert.js'

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
