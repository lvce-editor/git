import type { GitRef } from '../Types/Types.ts'
import * as GitRefType from '../GitRefType/GitRefType.ts'

const RE_REF_1 = /^refs\/heads\/([^ ]+) ([0-9a-f]{40}) (?:([0-9a-f]{40}))?(?: (.*))?$/
const RE_REF_2 = /^refs\/remotes\/([^/]+)\/([^ ]+) ([0-9a-f]{40}) (?:([0-9a-f]{40}))?(?: (.*))?$/
const RE_REF_3 = /^refs\/tags\/([^ ]+) ([0-9a-f]{40}) (?:([0-9a-f]{40}))?(?: (.*))?$/

export const parseGitRef = (line: string): GitRef | null => {
  const headMatch = line.match(RE_REF_1)
  if (headMatch) {
    return {
      commit: headMatch[2],
      name: headMatch[1],
      remote: '',
      type: GitRefType.Head,
    }
  }
  const remoteMatch = line.match(RE_REF_2)
  if (remoteMatch) {
    return {
      commit: remoteMatch[3],
      name: `${remoteMatch[1]}/${remoteMatch[2]}`,
      remote: remoteMatch[1],
      ...(remoteMatch[5] && { symbolicRef: remoteMatch[5] }),
      type: GitRefType.RemoteHead,
    }
  }
  const tagMatch = line.match(RE_REF_3)
  if (tagMatch) {
    return {
      commit: tagMatch[3] ?? tagMatch[2],
      name: tagMatch[1],
      remote: '',
      type: GitRefType.Tag,
    }
  }
  return null
}
