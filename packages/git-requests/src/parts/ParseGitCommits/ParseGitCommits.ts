import type { GitCommit } from '../Types/Types.ts'
import * as ParseGitCommit from '../ParseGitCommit/ParseGitCommit.ts'

export const parseGitCommits = (stdout: string): readonly GitCommit[] => {
  const lines = stdout.split('\n').filter(Boolean)
  return lines.map(ParseGitCommit.parseGitCommit)
}
