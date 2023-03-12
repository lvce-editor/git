const noop = (...args) => {
  return undefined
}

export const getFn = (method) => {
  switch (method) {
    default:
      return noop
  }
}
