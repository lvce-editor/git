import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitInit

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
