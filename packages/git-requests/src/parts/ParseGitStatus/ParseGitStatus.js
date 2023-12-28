import * as FileStateType from '../FileStateType/FileStateType.js'
import * as GitStatusType from '../GitStatusType/GitStatusType.js'

/**
 *
 * @param {string} line
 * @returns
 */
const getStatusXY = (line) => {
  return line.slice(0, 2)
}

/**
 *
 * @param {string} line
 * @returns
 */
const getStatusX = (line) => {
  return line[0]
}

/**
 *
 * @param {string} line
 * @returns
 */
const getStatusY = (line) => {
  return line[1]
}

/**
 *
 * @param {string} line
 * @returns
 */
const getFile = (line) => {
  return line.slice(3)
}

/**
 *
 * @param {any[]} index
 * @param {string} line
 * @returns
 */
const parseLine = (index, line) => {
  const statusXy = getStatusXY(line)
  switch (statusXy) {
    case GitStatusType.Untracked:
      index.push({
        file: getFile(line),
        status: FileStateType.Untracked,
      })
      return
    case GitStatusType.Ignored:
      index.push({
        file: getFile(line),
        status: FileStateType.Modified,
      })
      return
    case GitStatusType.BothDeleted:
      index.push({
        file: getFile(line),
        status: FileStateType.BothDeleted,
      })
      return
    case GitStatusType.AddedByUs:
      index.push({
        file: getFile(line),
        status: FileStateType.AddedByUs,
      })
      return
    case GitStatusType.DeletedByThem:
      index.push({
        file: getFile(line),
        status: FileStateType.DeletedByThem,
      })
      return
    case GitStatusType.AddedByThem:
      index.push({
        file: getFile(line),
        status: FileStateType.AddedByThem,
      })
      return
    case GitStatusType.DeletedByUs:
      index.push({
        file: getFile(line),
        status: FileStateType.DeletedByUs,
      })
      return
    case GitStatusType.BothAdded:
      index.push({
        file: getFile(line),
        status: FileStateType.BothAdded,
      })
      return
    case GitStatusType.BothModified:
      index.push({
        file: getFile(line),
        status: FileStateType.BothModified,
      })
      return
    default:
      break
  }
  const statusX = getStatusX(line)
  switch (statusX) {
    case GitStatusType.IndexModified:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexModified,
      })
      break
    case GitStatusType.IndexAdded:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexAdded,
      })
      break
    case GitStatusType.IndexModified:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexModified,
      })
      break
    case GitStatusType.IndexRenamed:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexModified,
      })
      break
    case GitStatusType.IndexCopied:
      index.push({
        file: getFile(line),
        status: FileStateType.IndexModified,
      })
      break
    default:
      break
  }
  const statusY = getStatusY(line)
  switch (statusY) {
    case GitStatusType.Modified:
      index.push({
        file: getFile(line),
        status: FileStateType.Modified,
      })
      break
    case GitStatusType.Deleted:
      index.push({
        file: getFile(line),
        status: FileStateType.Deleted,
      })
      break
    case GitStatusType.Added:
      index.push({
        file: getFile(line),
        status: FileStateType.IntentToAdd,
      })
      break
    case GitStatusType.IndexRenamed:
      index.push({
        file: getFile(line),
        status: FileStateType.IntentToRename,
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

/**
 *
 * @param {string[]} lines
 * @returns
 */
export const parseGitStatus = (lines) => {
  /**
   * @type{any[]}
   */
  const index = []
  for (const line of lines) {
    parseLine(index, line)
  }
  return index
}
