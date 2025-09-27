import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { RpcId } from '../RpcId/RpcId.ts'

export const registerMockRpc = (commandMap: any): RpcRegistry.MockRpc => {
  return RpcRegistry.registerMockRpc(RpcId, commandMap)
}
