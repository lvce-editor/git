export const state = {
  id: 0,
}

export const create = () => {
  return ++state.id
}

export const maybeIncrement = (id) => {
  if (id > state.id) {
    state.id = id + 1
  }
}
