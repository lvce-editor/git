import type { GitRef } from '../Types/Types.ts'
import * as GitRefType from '../GitRefType/GitRefType.ts'

const commitRegex = /^[\da-f]{40}$/

const getMetadata = (
  commitDate: string,
  authorName: string,
  subject: string,
  peeledCommitDate: string,
  peeledAuthorName: string,
  peeledSubject: string,
): { authorName: string; commitDate: string; subject: string } => {
  return {
    authorName: peeledAuthorName || authorName,
    commitDate: peeledCommitDate || commitDate,
    subject: peeledSubject || subject,
  }
}

export const parseGitRef = (line: string): GitRef | null => {
  const [refName, objectName, peeledObjectName, symbolicRef, commitDate, authorName, subject, peeledCommitDate, peeledAuthorName, peeledSubject] =
    line.split('\0')
  if (!refName || !commitRegex.test(objectName) || (peeledObjectName && !commitRegex.test(peeledObjectName))) {
    return null
  }
  const metadata = getMetadata(commitDate, authorName, subject, peeledCommitDate, peeledAuthorName, peeledSubject)
  if (refName.startsWith('refs/heads/')) {
    return {
      ...metadata,
      commit: objectName,
      name: refName.slice('refs/heads/'.length),
      remote: '',
      type: GitRefType.Head,
    }
  }
  if (refName.startsWith('refs/remotes/')) {
    const name = refName.slice('refs/remotes/'.length)
    const slashIndex = name.indexOf('/')
    if (slashIndex === -1) {
      return null
    }
    return {
      ...metadata,
      commit: objectName,
      name,
      remote: name.slice(0, slashIndex),
      ...(symbolicRef && { symbolicRef }),
      type: GitRefType.RemoteHead,
    }
  }
  if (refName.startsWith('refs/tags/')) {
    return {
      ...metadata,
      commit: peeledObjectName || objectName,
      name: refName.slice('refs/tags/'.length),
      remote: '',
      type: GitRefType.Tag,
    }
  }
  return null
}
