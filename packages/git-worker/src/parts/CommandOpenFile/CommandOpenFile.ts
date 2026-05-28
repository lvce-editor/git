import * as Rpc from '../Rpc/Rpc.ts'

/**
 * @param {string} file
 */
export const commandOpenFile = async (file: string): Promise<void> => {
  // TODO
  await Rpc.invoke('Main.openUri', file)
}
