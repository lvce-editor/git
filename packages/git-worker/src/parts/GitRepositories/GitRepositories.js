import * as Rpc from '../Rpc/Rpc.js'

export const getCurrent = async () => {
  return Rpc.invoke('Repositories.getCurrent')
}
