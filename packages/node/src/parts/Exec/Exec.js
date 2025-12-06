import { fileURLToPath } from 'node:url'
import { execa } from 'execa'
import * as Assert from '../Assert/Assert.js'

const getActualOptions = (options) => {
  if (options && options.cwd && options.cwd.startsWith('file://')) {
    return {
      ...options,
      cwd: fileURLToPath(options.cwd).toString(),
    }
  }

  return options
}

const truncate = (item, maxSize) => {
  if (item.length < maxSize) {
    return item
  }
  return item.slice(0, maxSize)
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
  const maxSize = 500_000
  return {
    stdout: truncate(stdout, maxSize),
    stderr: truncate(stderr, maxSize),
    exitCode,
  }
}
