import * as ParseGitRef from '../ParseGitRef/ParseGitRef.ts'

export const parseGitRefs = (stdout) => {
  const lines = stdout.split('\n')
  const refs = lines.map(ParseGitRef.parseGitRef).filter(Boolean)
  return refs
}
