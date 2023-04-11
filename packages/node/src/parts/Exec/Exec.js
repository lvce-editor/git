import { execa } from 'execa'

export const exec = async (command, args, options) => {
  const { stdout, stderr, exitCode } = await execa(command, args, options)
  return {
    stdout,
    stderr,
    exitCode,
  }
}
