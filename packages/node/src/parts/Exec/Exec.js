import { execa } from 'execa'
import * as Assert from '../Assert/Assert.js'
import { fileURLToPath } from 'node:url'

const getActualOptions = (options) => {
  if (options && options.cwd && options.cwd.startsWith('file://')) {
    return {
      ...options,
      cwd: fileURLToPath(options.cwd).toString(),
    }
  }
  return options
}

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {any} options
 * @returns
 */
export const exec = async (command, args, options) => {
  Assert.string(command)
  Assert.array(args)
  Assert.object(options)
  const actualOptions = getActualOptions(options)
  const { stdout, stderr, exitCode } = await execa(command, args, actualOptions)
  return {
    stdout,
    stderr,
    exitCode,
  }
}
