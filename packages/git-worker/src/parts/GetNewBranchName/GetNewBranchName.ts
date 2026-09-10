import * as GitRefType from '../GitRefType/GitRefType.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as WrappedGitRequests from '../WrappedGitRequests/WrappedGitRequests.ts'

export const getNewBranchName = async (): Promise<string | undefined> => {
  while (true) {
    const name = await Rpc.invoke('QuickPick.showInput', 'Branch name')
    if (typeof name !== 'string' || name === '') {
      return undefined
    }
    const refs = (await WrappedGitRequests.wrappedGitRequests.getRefs({})) as readonly { readonly name: string; readonly type: number }[]
    if (!refs.some((ref) => ref.type === GitRefType.Head && ref.name === name)) {
      return name
    }
    const retry = await Rpc.invoke('Confirm.prompt', `A branch named '${name}' already exists. Please choose a different name.`)
    if (!retry) {
      return undefined
    }
  }
}
