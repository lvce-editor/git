// import pTimeout from 'p-timeout'

import * as RefreshAfterGitCommand from '../RefreshAfterGitCommand/RefreshAfterGitCommand.ts'
import * as Rpc from '../Rpc/Rpc.ts'

/**
 * @template Result
 * @template Args
 * @param {{id:string, fn: (args: Args)=>Promise<Result>, args: Args}} param0
 */
export const execute = async <Result, Args>({
  args,
  fn,
  id,
}: Readonly<{ args: Args; fn: (args: Args) => Promise<Result>; id: string }>): Promise<Result> => {
  try {
    const r = await fn(args)
    await RefreshAfterGitCommand.refreshAfterGitCommand(id)
    return r
  } catch (error) {
    // @ts-ignore
    error.isExpected = true
    const shouldShowError = await Rpc.invoke('Config.showErrorMessage')
    if (shouldShowError) {
      await Rpc.invoke('Confirm.prompt', String(error))
    }
    throw error
  }
}
