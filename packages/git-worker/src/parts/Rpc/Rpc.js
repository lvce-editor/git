import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  ipc: undefined,
}

export const setIpc = (ipc) => {
  state.ipc = ipc
}

export const invoke = (message, ...params) => {
  return JsonRpc.invoke(state.ipc, message, ...params)
}
