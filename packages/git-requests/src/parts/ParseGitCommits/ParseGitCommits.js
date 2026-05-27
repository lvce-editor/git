import * as ParseGitCommit from '../ParseGitCommit/ParseGitCommit.js'

export const parseGitCommits = (stdout) => {
  const lines = stdout.split('\n').filter(Boolean)
  return lines.map(ParseGitCommit.parseGitCommit)
}
