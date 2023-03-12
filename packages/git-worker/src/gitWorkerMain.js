import * as HandleMessage from './parts/HandleMessage/HandleMessage.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Rpc from './parts/Rpc/Rpc.js'

const main = async () => {
  console.log('hello from git worker')
  const ipc = await IpcChild.listen({
    method: IpcChildType.Auto(),
  })
  ipc.onmessage = HandleMessage.handleMessage
  Rpc.setIpc(ipc)
}

main()
