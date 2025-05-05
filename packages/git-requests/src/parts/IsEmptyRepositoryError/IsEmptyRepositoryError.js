export const isEmptyGitRepositoryError = (error) => {
  return error && error.stderr && error.stderr === 'fatal: could not resolve HEAD'
}
