import * as Rpc from '../Rpc/Rpc.js'

export const exec = (command, args, options) => {
  return Rpc.invoke('Exec.exec', command, args, options)
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
