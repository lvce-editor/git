import { execa } from 'execa'
import * as Assert from '../Assert/Assert.js'

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
  console.time('exec')
  const { stdout, stderr, exitCode } = await execa(command, args, options)
  console.timeEnd('exec')
  return {
    stdout,
    stderr,
    exitCode,
  }
}
