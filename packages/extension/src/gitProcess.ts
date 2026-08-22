import { NodeRpcProcess } from '@lvce-editor/rpc'
import { commandMap } from '../../node/src/gitClient.js'

await NodeRpcProcess.create({ commandMap })
