// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

export const testWorker = async ({ execMap }) => {
  const invocations = []
  const rpc = {
    invoke(...args) {
      invocations.push(args)
      if (args[0] === 'Exec.exec') {
        const result = execMap[args[2][0]]
        if (!result) {
          throw new Error(`exec command not found ${args[2][0]}`)
        }
        return result
      }
    },
  }
  const worker = await startWorker(rpc)
  return {
    execute(...args) {
      return worker.execute(...args)
    },
    invocations,
  }
}
