export const isGitNoRepositoryError = (error) => {
  return (
    error &&
    error instanceof Error &&
    error.message.includes(
      `fatal: ambiguous argument 'HEAD~1': unknown revision or path not in the working tree.`
    )
  )
}
