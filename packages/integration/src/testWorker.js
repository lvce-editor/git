// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

export const testWorker = async ({ execMap, command }) => {
  const rpc = {
    invoke(...args) {
      if (args[0] === 'Exec.exec') {
        const result = execMap[args[2][0]]
        return result
      }
    },
  }
  const worker = await startWorker(rpc)
  const result = await worker.execute(...command)
  return result
}
