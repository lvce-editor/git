import { WebWorkerRpcClient } from '@lvce-editor/rpc'
export { commandMap } from './CommandMap/CommandMap.ts'
import { commandMap } from './CommandMap/CommandMap.ts'
import * as Main from './Main/Main.ts'

const main = async (): Promise<void> => {
  Main.main()
  // eslint-disable-next-line unicorn/no-global-object-property-assignment
  globalThis.rpc = await WebWorkerRpcClient.create({ commandMap })
}

// eslint-disable-next-line unicorn/no-top-level-side-effects
await main()
