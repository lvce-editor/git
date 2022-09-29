import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

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
  const workingTree = []
  const merge = []
  const untracked = []
  outer: for (const line of lines) {
    const statusXy = getStatusXY(line)
    switch (statusXy) {
      case '??':
        untracked.push({ file: getFile(line), status: 1 })
        continue outer
      case '!!':
        untracked.push({ file: getFile(line), status: 1 })
        continue outer
      default:
        break
    }
    const statusX = getStatusX(line)
    switch (statusX) {
      case 'M':
        index.push({ file: getFile(line), status: 1 })
        break
      case 'A':
        index.push({ file: getFile(line), status: 1 })
        break
      case 'D':
        index.push({ file: getFile(line), status: 1 })
        break
      case 'R':
        index.push({ file: getFile(line), status: 1 })
        break
      case 'C':
        index.push({ file: getFile(line), status: 1 })
        break
      default:
        break
    }
    const statusY = getStatusY(line)
    switch (statusY) {
      case 'M':
        workingTree.push({ file: getFile(line), status: 1 })
        break
      case 'D':
        workingTree.push({ file: getFile(line), status: 1 })
        break
      case 'A':
        workingTree.push({ file: getFile(line), status: 1 })
        break
      default:
        break
    }
  }

  const count =
    merge.length + index.length + workingTree.length + untracked.length

  return {
    merge,
    index,
    workingTree,
    untracked,
    gitRoot: cwd, // TODO
    count,
  }
}
