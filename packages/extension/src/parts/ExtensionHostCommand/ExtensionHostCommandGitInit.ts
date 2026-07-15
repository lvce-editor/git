import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'

export const id = CommandId.GitInit

type GitInitOptions = {
  readonly bare?: boolean
  readonly uri?: string
  readonly initialBranch?: string
}

export const execute = async (options: GitInitOptions = {}) => {
  const initOptions =
    typeof options === 'object' && options
      ? {
          bare: options.bare,
          cwd: options.uri,
          initialBranch: options.initialBranch,
        }
      : {}
  const result = await GitWorker.invoke('Command.gitInit', initOptions)
  await StatusBarCheckout.refresh(options.uri)
  return result
}
