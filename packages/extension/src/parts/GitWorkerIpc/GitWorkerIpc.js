import * as IpcParent from '../IpcParent/IpcParent.js'

/**
 *
 * @param {number} method
 * @returns
 */
export const create = (method) => {
  const url = new URL(
    '../../../../git-worker/src/gitWorkerMain.js',
    import.meta.url
  )
  return IpcParent.create({
    method,
    url,
  })
}
