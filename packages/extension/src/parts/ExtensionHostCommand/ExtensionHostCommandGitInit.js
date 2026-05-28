import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitInit

/**
 * @typedef {object} GitInitOptions
 * @property {boolean} [bare]
 * @property {string} [uri]
 * @property {string} [initialBranch]
 */

/**
 * @param {GitInitOptions | undefined} [options]
 */
export const execute = async (options = {}) => {
  const initOptions =
    typeof options === 'object' && options
      ? {
          bare: options.bare,
          cwd: options.uri,
          initialBranch: options.initialBranch,
        }
      : {}
  return GitWorker.invoke('Command.gitInit', initOptions)
}
