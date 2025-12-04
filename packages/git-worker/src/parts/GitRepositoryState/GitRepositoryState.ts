export const state = {
  currentRepository: undefined,
  listeners: Object.create(null),
  state: 'none',
}

export const setRepository = (repository) => {
  state.currentRepository = repository
}

export const getRepository = () => {
  return state.currentRepository
}
