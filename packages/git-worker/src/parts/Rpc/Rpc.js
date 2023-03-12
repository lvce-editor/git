import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  ipc: undefined,
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
