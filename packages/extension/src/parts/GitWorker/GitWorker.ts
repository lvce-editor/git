import * as OperationProgress from '../OperationProgress/OperationProgress.ts'
import * as LaunchGitWorker from '../LaunchGitWorker/LaunchGitWorker.ts'

type Rpc = {
  invoke(method: string, ...params: readonly any[]): Promise<any>
}

const state = {
  ipc: undefined,
  rpcPromise: undefined as Promise<Rpc> | undefined,
}

const getOrCreateRpc = async (): Promise<Rpc> => {
  if (!state.rpcPromise) {
    state.rpcPromise = LaunchGitWorker.launchGitWorker()
  }
  return state.rpcPromise
}

const progressMethods = new Set(['Git.commit', 'Git.addAllAndCommit', 'Git.push', 'Git.sync', 'Command.gitPush', 'Command.gitSync'])

export const invoke = async (method, ...params) => {
  const invokeActual = async () => {
    const rpc = await getOrCreateRpc()
    return rpc.invoke(method, ...params)
  }
  if (progressMethods.has(method)) {
    return OperationProgress.run(invokeActual)
  }
  return invokeActual()
}
