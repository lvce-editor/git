import { createNodeRpc } from '@lvce-editor/api'

type Rpc = {
  invoke(method: string, ...params: readonly any[]): Promise<any>
}

export const state = {
  rpcPromise: undefined as Promise<Rpc> | undefined,
}

const createRpc = async (): Promise<Rpc> => {
  const rpc = await createNodeRpc({
    id: 'git-client',
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
