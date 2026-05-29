import * as LaunchGitWorker from '../LaunchGitWorker/LaunchGitWorker.ts'

type Rpc = {
  invoke(method: string, ...params: readonly any[]): Promise<any>
}

export const state = {
  ipc: undefined,
  rpcPromise: undefined as Promise<Rpc> | undefined,
}

const getOrCreateRpc = async (): Promise<Rpc> => {
  if (!state.rpcPromise) {
    state.rpcPromise = LaunchGitWorker.launchGitWorker() as Promise<Rpc>
  }
  return state.rpcPromise
}

export const invoke = async (method, ...params) => {
  const rpc = await getOrCreateRpc()
  return rpc.invoke(method, ...params)
}
