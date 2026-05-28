import * as ParseGitRef from '../ParseGitRef/ParseGitRef.ts'
import type { GitRef } from '../Types/Types.ts'

export const parseGitRefs = (stdout: string): readonly GitRef[] => {
  const lines = stdout.split('\n')
  const refs = lines.map(ParseGitRef.parseGitRef).filter((ref): ref is GitRef => ref !== null)
  return refs
}
