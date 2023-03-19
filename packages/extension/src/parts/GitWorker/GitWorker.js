import * as Callback from '../Callback/Callback.js'
import * as GitWorkerUrl from '../GitWorkerUrl/GitWorkerUrl.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as GetResponse from '../GetResponse/GetResponse.js'

export const state = {
  ipc: undefined,
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const handleMessage = async (event) => {
  const message = event.data
  console.log({ message })
  if (message.id) {
    if ('result' in message || 'error' in message) {
      Callback.resolve(message.id, message)
    } else if ('method' in message) {
      const response = await GetResponse.getResponse(message)
      const target = event.target
      target.postMessage(response)
    }
  } else {
    console.log(message)
  }
}

const createIpc = async ({ url, name }) => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorker,
    url,
    name,
  })
  ipc.onmessage = handleMessage
  return ipc
}

const createRpc = async () => {
  const workerUrl = GitWorkerUrl.getGitWorkerUrl()
  const ipc = await createIpc({ url: workerUrl, name: 'Git Worker' })
  return {
    ipc,
    invoke(method, ...params) {
      return JsonRpc.invoke(this.ipc, method, ...params)
    },
  }
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