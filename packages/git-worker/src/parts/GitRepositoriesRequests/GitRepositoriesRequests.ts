// import pTimeout from 'p-timeout'

import * as Rpc from '../Rpc/Rpc.ts'

export const state = {
  changeListeners: [],
  running: Object.create(null),
}

const runListeners = () => {
  for (const listener of state.changeListeners) {
    // @ts-ignore
    listener()
  }
}

/**
 * @template Result
 * @template Args
 * @param {{id:string, fn: (args: Args)=>Promise<Result>, args: Args}} param0
 */
export const execute = async ({ args, fn, id }) => {
  state.running[id] ||= 0
  state.running[id]++
  runListeners()
  try {
    const r = await fn(args)
    return r
  } catch (error) {
    // @ts-ignore
    error.isExpected = true
    const shouldShowError = await Rpc.invoke('Config.showErrorMessage')
    if (shouldShowError) {
      await Rpc.invoke('Confirm.prompt', `${error}`)
    }
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
  // @ts-ignore
  state.changeListeners.push(listener)
}

export const offChange = (listener) => {
  // @ts-ignore
  const index = state.changeListeners.indexOf(listener)
  state.changeListeners.splice(index, 1)
}
