export const isDidNotMatchAnyFilesError = (error: unknown): boolean => {
  return error && error instanceof Error && error.message.includes(`fatal: pathspec '.' did not match any files`)
}
