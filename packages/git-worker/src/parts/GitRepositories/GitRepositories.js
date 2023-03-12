import * as GitFind from '../GitFind/GitFind.js'

export const state = {
  currentRepository: undefined,
  state: 'none',
  listeners: Object.create(null),
}

// TODO getCurrent shouldn't have side effect of mutating state
export const getCurrent = async (path) => {
  if (!path) {
    throw new Error('no workspace folder is open')
  }
  const git = await GitFind.findGit()
  if (!git) {
    throw new Error('git binary not found')
  }
  state.currentRepository = {
    path,
    gitPath: git.path,
    gitVersion: git.version,
  }
  return {
    path,
    gitPath: git.path,
    gitVersion: git.version,
  }
}

export const getCurrentCached = async () => {
  if (!state.currentRepository) {
    state.currentRepository = await getCurrent()
  }
  return state.currentRepository
}

export const addListener = (event, fn) => {
  state.listeners[event] ||= []
  state.listeners[event].push(fn)
}

export const removeListener = (event, fn) => {
  const listeners = state.listeners[event]
  const index = listeners.indexOf(fn)
  listeners.splice(index, 1)
}
