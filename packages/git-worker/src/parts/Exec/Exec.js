import * as Rpc from '../Rpc/Rpc.js'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = async (command, args, options) => {
  return Rpc.invoke('Exec.exec', command, args, options)
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
