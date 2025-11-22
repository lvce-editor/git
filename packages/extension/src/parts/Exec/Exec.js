import * as Assert from '../Assert/Assert.js'
import { getInvoke } from '../GetInvoke/GetInvoke.js'
import * as Trace from '../Trace/Trace.js'

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
  const start = performance.now()
  const invoke = getInvoke(options.cwd)
  const { stdout, stderr, exitCode } = await invoke('Exec.exec', command, args, options)
  const end = performance.now()
  Trace.trace(`git ${args.join(' ')} (${(end - start).toFixed(1)}ms)\n${stdout}\n${stderr}`)
  return {
    stdout,
    stderr,
    exitCode,
  }
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
