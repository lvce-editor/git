import { invoke } from '../GitWebWorker/GitWebWorker.js'
import * as Rpc from '../Rpc/Rpc.js'

export const getInvoke = async (scheme) => {
  switch (scheme) {
    case 'file://':
      return Rpc.invoke
    default:
      return invoke
  }
}
