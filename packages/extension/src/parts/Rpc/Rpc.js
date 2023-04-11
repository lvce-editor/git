import * as ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'

export const state = {
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const getGitClientPath = (path) => {
  return `${path}/../node/src/gitClient.js`
}

const createRpc = async () => {
  const path = ExtensionInfo.getPath()
  const gitClientPath = getGitClientPath(path)
  console.log({ gitClientPath })
  const rpc = await vscode.createNodeRpc({
    path: gitClientPath,
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
