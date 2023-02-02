import * as GitWorkerIpc from '../GitWorkerIpc/GitWorkerIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const state = {
  ipc: undefined,
}

export const intialize = async () => {
  state.ipc = await GitWorkerIpc.create(IpcParentType.ModuleWorker)
}

export const invoke = async (method, ...params) => {
  console.log({ method, params })
  state.ipc.send({
    jsonrpc: '2.0',
    method,
    params,
  })
  // TODO
}
