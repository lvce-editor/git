export const state = {
  currentRepository: undefined,
  state: 'none',
  listeners: Object.create(null),
}

export const setRepository = (repository) => {
  state.currentRepository = repository
}

export const getRepository = () => {
  return state.currentRepository
}
