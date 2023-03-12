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
 * @param {string[]} lines
 * @returns
 */
export const parseLines = (lines) => {
  const index = []
  outer: for (const line of lines) {
    const statusXy = getStatusXY(line)
    switch (statusXy) {
      case GitStatusType.Untracked:
        index.push({ file: getFile(line), status: FileStateType.Untracked })
        continue outer
      case GitStatusType.Ignored:
        index.push({ file: getFile(line), status: FileStateType.Modified })
        continue outer
      default:
        break
    }
    const statusX = getStatusX(line)
    switch (statusX) {
      case GitStatusType.IndexModified:
        index.push({ file: getFile(line), status: FileStateType.Modified })
        break
      case GitStatusType.IndexAdded:
        index.push({ file: getFile(line), status: FileStateType.Modified })
        break
      case GitStatusType.IndexModified:
        index.push({ file: getFile(line), status: FileStateType.Modified })
        break
      case GitStatusType.IndexRenamed:
        index.push({ file: getFile(line), status: FileStateType.Modified })
        break
      case GitStatusType.IndexCopied:
        index.push({ file: getFile(line), status: FileStateType.Modified })
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
          status: FileStateType.Modified,
        })
        break
      case GitStatusType.Added:
        index.push({
          file: getFile(line),
          status: FileStateType.Modified,
        })
        break
      default:
        break
    }
  }
  return index
}
