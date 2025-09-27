import * as LaunchGitWebWorker from '../LaunchGitWebWorker/LaunchGitWebWorker.js'

export const state = {
  ipc: undefined,
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const getOrCreateRpc = async () => {
  if (!state.rpcPromise) {
    state.rpcPromise = LaunchGitWebWorker.launchGitWebWorker()
  }
  return state.rpcPromise
}

export const invoke = async (method, ...params) => {
  const rpc = await getOrCreateRpc()
  return rpc.invoke(method, ...params)
}
