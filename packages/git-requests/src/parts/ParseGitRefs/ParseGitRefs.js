import * as ParseGitRef from '../ParseGitRef/ParseGitRef.js'

export const parseGitRefs = (stdout) => {
  const lines = stdout.split('\n')
  const refs = lines.map(ParseGitRef.parseGitRef).filter(Boolean)
  return refs
}
