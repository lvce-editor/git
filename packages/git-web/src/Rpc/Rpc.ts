import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { RpcId } from '../RpcId/RpcId.ts'

export const invoke = async (method, ...params): Promise<any> => {
  const rpc = RpcRegistry.get(RpcId)
  return rpc.invoke(method, ...params)
}
