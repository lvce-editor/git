import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { RpcId } from '../RpcId/RpcId.ts'

export const invoke = async (method: string, ...parameters: readonly any[]): Promise<any> => {
  const rpc = RpcRegistry.get(RpcId) || globalThis.rpc
  return rpc.invoke(method, ...parameters)
}
