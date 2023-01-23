import * as Trace from '../Trace/Trace.js'

export const state = {
  /**
   * @param {string} command
   * @param {string[]} args
   * @param {import('execa').Options} options
   * @returns
   */
  async exec(command, args, options) {
    const start = performance.now()
    const { stdout, stderr } = await vscode.exec(command, args, {
      ...options,
    })
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
  },
}

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = (command, args, options) => {
  return state.exec(command, args, options)
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
