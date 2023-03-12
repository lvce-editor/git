import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

const noop = (...args) => {
  return undefined
}

const getFn = (method) => {
  switch (method) {
    case GitWorkerCommandType.GetChangedFiles:
      return GetChangedFiles.getChangedFiles
    default:
      return noop
  }
}

export const execute = async (method, ...params) => {
  const fn = getFn(method)
  // @ts-ignore
  const result = await fn(...params)
  return result
}
