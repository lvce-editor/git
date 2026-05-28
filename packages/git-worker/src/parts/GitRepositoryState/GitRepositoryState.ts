export const state = {
  currentRepository: undefined as undefined | { gitPath: string; gitVersion: string; path: string },
  listeners: Object.create(null),
  state: 'none',
}

export const setRepository = (repository: Readonly<{ gitPath: string; gitVersion: string; path: string }>): void => {
  state.currentRepository = repository
}

export const getRepository = (): undefined | { gitPath: string; gitVersion: string; path: string } => {
  return state.currentRepository
}
