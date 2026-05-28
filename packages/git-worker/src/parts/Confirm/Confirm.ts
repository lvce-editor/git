import * as Rpc from '../Rpc/Rpc.ts'

export const confirm = async (message: string): Promise<boolean> => {
  const shouldConfirm = await Rpc.invoke('Config.confirmDiscard')
  if (!shouldConfirm) {
    return true
  }
  const result = await Rpc.invoke('Confirm.prompt', message)
  return result
}
