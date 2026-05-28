export const parseGitCommit = (line) => {
  const [hash, message = ''] = line.split('\t')
  return {
    hash,
    message,
  }
}
