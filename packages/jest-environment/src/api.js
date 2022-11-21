class VError extends Error {
  constructor(error, message) {
    super(message)
  }
}

export const api = {
  VError,
}
