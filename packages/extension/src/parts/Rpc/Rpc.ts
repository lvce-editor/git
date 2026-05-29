import * as ExtensionInfo from '../ExtensionInfo/ExtensionInfo.ts'
import * as GetGitClientPath from '../GetGitClientPath/GetGitClientPath.ts'

type Rpc = {
  invoke(method: string, ...params: readonly any[]): Promise<any>
}

export const state = {
  rpcPromise: undefined as Promise<Rpc> | undefined,
}

const createRpc = async (): Promise<Rpc> => {
  const path = ExtensionInfo.getPath()
  const gitClientPath = GetGitClientPath.getGitClientPath(path)
  // @ts-ignore
  const rpc = await vscode.createNodeRpc({
    path: gitClientPath,
    name: 'Git',
  })
  return rpc
}

export const invoke = async (method, ...params) => {
  if (!state.rpcPromise) {
    state.rpcPromise = createRpc()
  }
  const rpc = await state.rpcPromise
  // @ts-ignore
  const result = await rpc.invoke(method, ...params)
  return result
}
