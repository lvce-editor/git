import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { RpcId } from '../RpcId/RpcId.ts'

export const invoke = async (method, ...params) => {
  const rpc = get(RpcId)
  const result = await globalThis.rpc.invoke(method, ...params)
  return result
}
