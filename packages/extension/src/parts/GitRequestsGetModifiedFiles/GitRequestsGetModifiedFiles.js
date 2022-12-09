import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'
import * as FileStateType from '../FileStateType/FileStateType.js'
import * as GitStatusType from '../GitStatusType/GitStatusType.js'

const parseStatusLine = (line) => {
  const x = line[0]
  const y = line[1]
  const file = line.slice(3)
  return {
    x,
    y,
    file,
  }
}

const getStatusXY = (line) => {
  return line.slice(0, 2)
}

const getStatusX = (line) => {
  return line[0]
}

const getStatusY = (line) => {
  return line[1]
}

const getFile = (line) => {
  return line.slice(3)
}

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const getModifiedFiles = async ({ cwd, gitPath }) => {
  let gitResult
  try {
    gitResult = await Git.exec({
      args: ['status', '--porcelain'],
      cwd,
      gitPath,
      name: 'getModifiedFiles',
    })
  } catch (error) {
    console.log({ error })
    throw new GitError(error, 'getModifiedFiles')
  }
  const lines = gitResult.stdout === '' ? [] : gitResult.stdout.split('\n')
  const index = []
  outer: for (const line of lines) {
    const statusXy = getStatusXY(line)
    switch (statusXy) {
      case GitStatusType.Untracked:
        index.push({ file: getFile(line), status: FileStateType.Modified })
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

  const count = index.length

  return {
    index,
    gitRoot: cwd, // TODO
    count,
  }
}
