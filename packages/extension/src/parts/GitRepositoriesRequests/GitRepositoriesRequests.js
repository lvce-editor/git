import pTimeout from 'p-timeout'
import * as Constants from '../Constants/Constants.js'

export const state = {
  running: Object.create(null),
  changeListeners: [],
}

const runListeners = () => {
  for (const listener of state.changeListeners) {
    listener()
  }
}

/**
 * @template Result
 * @template Args
 * @param {{id:string, fn: (args: Args)=>Promise<Result>, args: Args}} param0
 */
export const execute = async ({ id, fn, args }) => {
  state.running[id] ||= 0
  state.running[id]++
  runListeners()
  try {
    console.log('before')
    const r = await pTimeout(
      fn(args),
      Constants.CommandTimeout,
      `Git ${id} timeout out after ${Constants.CommandTimeout}ms`
    )
    console.log(r)
    console.log('after')
    return r
  } catch (error) {
    throw error
  } finally {
    state.running[id]--
    if (state.running[id] === 0) {
      delete state.running[id]
    }
    runListeners()
  }
}

export const isRunning = (operationId) => {
  return operationId in state.running
}

export const onChange = (listener) => {
  state.changeListeners.push(listener)
}

export const offChange = (listener) => {
  const index = state.changeListeners.indexOf(listener)
  state.changeListeners.splice(index, 1)
}
