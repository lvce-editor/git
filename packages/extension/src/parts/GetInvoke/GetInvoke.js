import { invoke } from '../GitWebWorker/GitWebWorker.js'
import * as Rpc from '../Rpc/Rpc.js'

const RE_SCHEME = /^[a-z\-]+:\/\//

const getScheme = (uri) => {
  const scheme = uri.match(RE_SCHEME)
  if (!scheme) {
    return ''
  }
  return scheme[0]
}

export const getInvoke = (uri) => {
  const scheme = getScheme(uri)
  if (!scheme || scheme.startsWith('file://')) {
    return Rpc.invoke
  }
  return invoke
}
