import type { GitStatusFile } from '../Types/Types.ts'
import * as FileStateType from '../FileStateType/FileStateType.ts'
import * as GitStatusType from '../GitStatusType/GitStatusType.ts'

const getStatusXY = (line: string): string => {
  return line.slice(0, 2)
}

const getStatusX = (line: string): string => {
  return line[0]
}

const getStatusY = (line: string): string => {
  return line[1]
}

const gitPathEscapeMap: Readonly<Record<string, string>> = {
  a: '\u{7}',
  b: '\u{8}',
  f: '\u{C}',
  n: '\u{A}',
  r: '\u{D}',
  t: '\u{9}',
  v: '\u{B}',
}

const decodeGitPath = (path: string): string => {
  if (!path.startsWith('"') || !path.endsWith('"')) {
    return path
  }
  const content = path.slice(1, -1)
  const bytes: number[] = []
  const encoder = new TextEncoder()
  for (let i = 0; i < content.length; i++) {
    const char = content[i]
    if (char !== '\\') {
      bytes.push(...encoder.encode(char))
      continue
    }
    const next = content[i + 1]
    const octal = content.slice(i + 1, i + 4)
    if (/^[0-7]{3}$/.test(octal)) {
      bytes.push(Number.parseInt(octal, 8))
      i += 3
      continue
    }
    if (next in gitPathEscapeMap) {
      bytes.push(...encoder.encode(gitPathEscapeMap[next]))
    } else if (next) {
      bytes.push(...encoder.encode(next))
    }
    i++
  }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

const getFile = (line: string): string => {
  return decodeGitPath(line.slice(3))
}

export const parseGitStatusLine = (index: GitStatusFile[], line: string): void => {
  const statusXy = getStatusXY(line)
  switch (statusXy) {
    case GitStatusType.AddedByThem:
      index.push({
        file: getFile(line),
        status: FileStateType.AddedByThem,
      })
      return
    case GitStatusType.AddedByUs:
      index.push({
        file: getFile(line),
        status: FileStateType.AddedByUs,
      })
      return
    case GitStatusType.BothAdded:
      index.push({
        file: getFile(line),
        status: FileStateType.BothAdded,
      })
      return
    case GitStatusType.BothDeleted:
      index.push({
        file: getFile(line),
        status: FileStateType.BothDeleted,
      })
      return
    case GitStatusType.BothModified:
      index.push({
        file: getFile(line),
        status: FileStateType.BothModified,
      })
      return
    case GitStatusType.DeletedByThem:
      index.push({
        file: getFile(line),
        status: FileStateType.DeletedByThem,
      })
      return
    case GitStatusType.DeletedByUs:
      index.push({
        file: getFile(line),
        status: FileStateType.DeletedByUs,
      })
      return
    case GitStatusType.Ignored:
      index.push({
        file: getFile(line),
        status: FileStateType.Modified,
      })
      return
    case GitStatusType.Untracked:
      index.push({
        file: getFile(line),
        status: FileStateType.Untracked,
      })
      return
    default:
      break
  }
  const statusX = getStatusX(line)
  switch (statusX) {
    case GitStatusType.IndexAdded:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexAdded,
      })
      break
    case GitStatusType.IndexCopied:
    case GitStatusType.IndexModified:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexModified,
      })
      break
    case GitStatusType.IndexDeleted:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexDeleted,
      })
      break
    case GitStatusType.IndexRenamed:
      const arrowIndex = line.indexOf('->')
      if (arrowIndex !== -1) {
        index.push({
          file: decodeGitPath(line.slice(arrowIndex + 3)),
          status: FileStateType.IndexRenamed,
        })
      }
      break
    default:
      break
  }
  const statusY = getStatusY(line)
  switch (statusY) {
    case GitStatusType.Added:
      index.push({
        file: getFile(line),
        status: FileStateType.IntentToAdd,
      })
      break
    case GitStatusType.Deleted:
      index.push({
        file: getFile(line),
        status: FileStateType.Deleted,
      })
      break
    case GitStatusType.IndexRenamed:
      index.push({
        file: getFile(line),
        status: FileStateType.IntentToRename,
      })
      break
    case GitStatusType.Modified:
      index.push({
        file: getFile(line),
        status: FileStateType.Modified,
      })
      break
    case GitStatusType.TypeChanged:
      index.push({
        file: getFile(line),
        status: FileStateType.TypeChanged,
      })
      break
    default:
      break
  }
}
