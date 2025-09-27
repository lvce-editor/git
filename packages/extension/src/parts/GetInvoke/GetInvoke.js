import { invoke } from '../GitWebWorker/GitWebWorker.js'
import * as Rpc from '../Rpc/Rpc.js'

export const getInvoke = (scheme) => {
  if (!scheme || scheme.startsWith('file://')) {
    return Rpc.invoke
  }
  return invoke
}
