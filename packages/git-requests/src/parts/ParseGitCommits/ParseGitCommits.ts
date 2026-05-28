import * as ParseGitCommit from '../ParseGitCommit/ParseGitCommit.ts'
import type { GitCommit } from '../Types/Types.ts'

export const parseGitCommits = (stdout: string): readonly GitCommit[] => {
  const lines = stdout.split('\n').filter(Boolean)
  return lines.map(ParseGitCommit.parseGitCommit)
}
