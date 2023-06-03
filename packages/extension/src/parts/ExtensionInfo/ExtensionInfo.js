import * as Assert from '../Assert/Assert.js'

export const state = {
  path: '',
}

export const setPath = (path) => {
  Assert.string(path)
  state.path = path
}

export const getPath = () => {
  return state.path
}
