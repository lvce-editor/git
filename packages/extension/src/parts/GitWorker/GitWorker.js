import * as Command from '../Command/Command.js'
import * as GitWorkerUrl from '../GitWorkerUrl/GitWorkerUrl.js'

export const state = {
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const createRpc = async () => {
  const workerUrl = GitWorkerUrl.getGitWorkerUrl()
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Git Worker',
    execute: Command.execute,
  })
  return rpc
}

const getOrCreateRpc = async () => {
  if (!state.rpcPromise) {
    state.rpcPromise = createRpc()
  }
  return state.rpcPromise
}

export const invoke = async (method, ...params) => {
  const rpc = await getOrCreateRpc()
  return rpc.invoke(method, ...params)
}
