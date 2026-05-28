import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const root = `${__dirname}/../../..`

const workerPath = join(root, 'packages', 'git-worker', 'src', 'gitWorkerMain.ts')

type RpcLike = {
  invoke(method: string, ...args: readonly any[]): any
}

export const startWorker = async (rpc: Readonly<RpcLike>): Promise<{ execute(commandId: string, ...args: readonly any[]): any }> => {
  const workerUrl = pathToFileURL(workerPath).toString()
  globalThis.rpc = rpc
  const module = await import(workerUrl)
  const { commandMap } = module
  return {
    execute(commandId: string, ...args: readonly any[]): any {
      const command = commandMap[commandId]
      return command(...args)
    },
  }
}
