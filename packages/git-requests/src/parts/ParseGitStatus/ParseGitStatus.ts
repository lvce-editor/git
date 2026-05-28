import * as ParseGitStatusLine from '../ParseGitStatusLine/ParseGitStatusLine.ts'
import type { GitStatusFile } from '../Types/Types.ts'

export const parseGitStatus = (lines: readonly string[]): readonly GitStatusFile[] => {
  const index: GitStatusFile[] = []
  for (const line of lines) {
    ParseGitStatusLine.parseGitStatusLine(index, line)
  }
  return index
}
