export const getShortCommit = (commit: string): string => {
  return commit.slice(0, 8)
}
