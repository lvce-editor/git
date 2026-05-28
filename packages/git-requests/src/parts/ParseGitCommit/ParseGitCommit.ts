import type { GitCommit } from '../Types/Types.ts'

export const parseGitCommit = (line: string): GitCommit => {
  const [hash, message = ''] = line.split('\t')
  return {
    hash,
    message,
  }
}
