import * as Rpc from '../Rpc/Rpc.js'
import * as Trace from '../Trace/Trace.js'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = async (command, args, options) => {
  const start = performance.now()
  const { stdout, stderr } = await Rpc.invoke(
    'Exec.exec',
    command,
    args,
    options
  )
  const end = performance.now()
  Trace.trace(
    `git ${args.join(' ')} (${(end - start).toFixed(
      1
    )}ms)\n${stdout}\n${stderr}`
  )
  return {
    stdout,
    stderr,
  }
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
