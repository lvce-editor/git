import * as ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
import * as GetGitClientPath from '../GetGitClientPath/GetGitClientPath.js'

export const state = {
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const createRpc = async () => {
  const path = ExtensionInfo.getPath()
  const gitClientPath = GetGitClientPath.getGitClientPath(path)
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
