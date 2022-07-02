/**
 *  Useful git commands
 *
 *  | Command                                  | Description                       |
 *  |------------------------------------------|-----------------------------------|
 *  | git rev-parse --show-toplevel            | Get Root                          |
 *  | git status --porcelain                   | Get modified files                |
 *  | git add .                                | Add all files                     |
 *  | git commit -m "some changes"             | Make a commit                     |
 *  | git push                                 | Push changes to remote repository |
 *  | git show HEAD:./myFile.txt               | Show file content before changes  |
 *  | git branch --show-current                | Get current Branch                |
 *  | git diff --name-only --cached            | Get added files                   |
 *  | git ls-files --others --exclude-standard | ???                               |
 *  | git log -1 --pretty=%B                   | Get last commit message           |
 *  | git config --get remote.origin.url       | Get remote url                    |
 *
 */

import VError from 'verror'
import * as Git from '../Git/Git.js'

// TODO prettier makes the error declarations ugly

export const E_NO_CONFIGURED_PUSH_DESTINATION =
  'E_NO_CONFIGURED_PUSH_DESTINATION'
export const E_PUSH_REJECTED = 'E_PUSH_REJECTED'
export const E_REMOTE_CONNECTION_ERROR = 'E_REMOTE_CONNECTION_ERROR'
export const E_NO_UPSTREAM_BRANCH = 'E_NO_UPSTREAM_BRANCH'
export const E_PERMISSION_DENIED = 'E_PERMISSION_DENIED'
export const E_PATH_NOT_FOUND = 'E_PATH_NOT_FOUND'
export const E_NO_LOCAL_CHANGES = 'E_NO_LOCAL_CHANGES'
export const E_UNKNOWN_ERROR = 'E_UNKNOWN_ERROR'
export const E_EMPTY_COMMIT_MESSAGE = 'E_EMPTY_COMMIT_MESSAGE'
export const E_NOT_A_GIT_REPOSITORY = 'E_NOT_A_GIT_REPOSITORY'
export const E_INVALID_PATH = 'E_INVALID_PATH'
export const E_NO_USER_NAME_CONFIGURED = 'E_NO_USER_NAME_CONFIGURED'
export const E_DIRTY_WORKING_TREE = 'E_DIRTY_WORKING_TREE'
export const E_CANNOT_REBASE_MULTIPLE_BRANCHES =
  'E_CANNOT_REBASE_MULTIPLE_BRANCHES'
export const E_MERGE_CONFLICT = 'E_MERGE_CONFLICT'
export const E_CANNOT_LOCK_REF = 'E_CANNOT_LOCK_REF'

const RE_GIT_FATAL_PATH_SPEC = /^fatal: pathspec .* did not match any files/
const RE_GIT_FATAL_NOT_A_GIT_REPOSITORY = /^fatal: not a git repository/
const RE_GIT_EMPTY_COMMIT_MESSAGE =
  /^Aborting commit due to empty commit message./
const RE_GIT_NO_CONFIGURED_PUSH_DESTINATION =
  /^fatal: No configured push destination/
const RE_GIT_COULD_NOT_READ_FROM_REMOTE_REPOSITORY =
  /^Could not read from remote repository/

const RE_GIT_PLEASE_TELL_ME_WHO_YOU_ARE = /Please tell me who you are\./

const RE_GIT_FATAL_THE_CURRENT_BRANCH_HAS_NO_UPSTREAM_BRANCH =
  /^fatal: The current branch .* has no upstream branch/

const RE_GIT_PERMISSION_DENIED = /Permission.*denied/

const RE_GIT_MERGE_CONFLICT = /^CONFLICT \([^)]+\): \b/m

const firstLine = (text) => {
  const newLineIndex = text.indexOf('\n')
  if (newLineIndex === -1) {
    return text
  }
  return text.slice(0, text.indexOf('\n'))
}

const isRelevantLine = (line) => {
  if (line.startsWith('> ')) {
    return false
  }
  if (line.startsWith('From ')) {
    return false
  }
  if (line.startsWith('* ')) {
    return false
  }
  if (line.startsWith(' *')) {
    return false
  }
  return true
}

const fatalOrHintOrSshOrRemoteLine = (text) => {
  const lines = text.split('\n')
  for (const line of lines) {
    if (isRelevantLine(line)) {
      return line
    }
  }
  return ''
}

// TODO
const errorSnippet = (stderr) => {
  console.log({ stderr })
  if (/nothing to commit/s.test(stderr)) {
    return 'nothing to commit'
  }
  return fatalOrHintOrSshOrRemoteLine(stderr) || firstLine(stderr)
}

const getGitErrorMessage = (error, name) => {
  let errorMessage = `Git: ${name} failed to execute`
  if (error.stderr) {
    errorMessage = `${errorMessage}: ` + errorSnippet(error.stderr)
  }
  return errorMessage
}

const getErrorMessageAndCause = (error, message) => {
  return {
    cause: '',
    errorMessage: '',
  }
}

class GitError extends VError {
  constructor(error, command) {
    const errorMessage = `Git`
    let cause = new Error()
    if (error && error.stderr) {
      cause.message = errorSnippet(error.stderr)
      // @ts-ignore
    } else {
      cause.message = error.message
    }
    super(cause, errorMessage)
    if (error && error.stderr) {
      this.stderr = error.stderr
    }
  }
}

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const add = async ({ cwd, gitPath, file }) => {
  try {
    const gitResult = await Git.exec({
      args: ['add', file],
      name: 'add',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'add')
  }
}

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const addAll = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['add', '.'],
      cwd,
      gitPath,
      name: 'addAll',
    })
  } catch (error) {
    throw new GitError(error, 'addAll')
  }
}

/**
 *
 * @param {{cwd:string, message:string, gitPath:string }} options
 */
export const addAllAndCommit = async ({ cwd, gitPath, message }) => {
  try {
    await Git.exec({
      args: ['add', '.'],
      cwd,
      gitPath,
      name: 'addAllAndCommit/add',
    })
    await Git.exec({
      args: ['commit', '-m', message],
      cwd,
      gitPath,
      name: 'addAllAndCommit/commit',
    })
    await Git.exec({
      args: ['push'],
      cwd,
      gitPath,
      name: 'addAllAndCommit/push',
    })
  } catch (error) {
    throw new GitError(error, 'addAllAndCommit')
  }
}

/**
 *
 * @param {{cwd:string, message:string}} options
 */
export const addAllAndCommitAndPush = async (options) => {
  // await addAll(options)
  // await commit(options)
  // await push(options)
}

/**
 * @param {{cwd:string, ref:string, gitPath:string  }} options
 */
export const checkout = async ({ cwd, gitPath, ref }) => {
  try {
    const gitResult = await Git.exec({
      args: ['checkout', ref],
      cwd,
      gitPath,
      name: 'checkout',
    })
  } catch (error) {
    throw new GitError(error, 'checkout')
  }
}

/**
 * @param {{cwd:string, gitPath:string, message:string}} options
 */
export const commit = async ({ cwd, gitPath, message }) => {
  try {
    const gitResult = await Git.exec({
      args: ['commit', '-m', message],
      cwd,
      gitPath,
      name: 'commit',
    })
  } catch (error) {
    throw new GitError(error, 'commit')
  }
}

/**
 * @param {{cwd:string,gitPath:string, name:string}} options
 */
export const deleteBranch = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['branch', '-d'],
      cwd,
      gitPath,
      name: 'deleteBranch',
    })
  } catch (error) {
    throw new GitError(error, 'deleteBranch')
  }
}

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const getAddedFiles = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['diff', '--name-only', '--cached'],
      cwd,
      gitPath,
      name: 'getAddedFiles',
    })
  } catch (error) {
    throw new GitError(error, 'getAddedFiles')
  }
}

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const push = async ({ cwd, gitPath }) => {
  try {
    await Git.exec({
      args: ['push', '--porcelain'],
      cwd,
      gitPath,
      name: 'push',
    })
    console.log('finished')
  } catch (error) {
    throw new GitError(error, 'push')
  }
}

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const fetch = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['fetch', '--all'],
      cwd,
      gitPath,
      name: 'fetch',
    })
  } catch (error) {
    throw new GitError(error, 'fetch')
  }
}

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const getCurrentBranch = async ({ cwd, gitPath }) => {
  let gitResult
  try {
    gitResult = await Git.exec({
      args: ['branch', '--show-current'],
      cwd,
      gitPath,
      name: 'getCurrentBranch',
    })
  } catch (error) {
    throw new GitError(error, 'getCurrentBranch')
  }

  const branch = gitResult.stdout
  return branch
}

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

const getGitRoot = async ({ cwd, gitPath }) => {
  let gitResult
  try {
    gitResult = await Git.exec({
      args: ['rev-parse', '--show-toplevel'],
      cwd,
      gitPath,
      name: 'getGitRoot',
    })
  } catch (error) {
    throw new GitError(error, 'getGitRoot')
  }
  return gitResult.stdout
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

/**
 *
 * @param {{cwd:string, gitPath:string}} options
 */
export const getFileBefore = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['show', `HEAD:${cwd}`],
      cwd,
      gitPath,
      name: 'getFileBefore',
    })
  } catch (error) {
    throw new GitError(error, 'getFileBefore')
  }
}

/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const pull = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['pull'],
      cwd,
      name: 'pull',
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'pull')
  }
}

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const pullAndRebase = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'pullAndRebase',
    })
  } catch (error) {
    throw new GitError(error, 'pullAndRebase')
  }
}

/**
 *
 * @param {{cwd:string, gitPath:string}} options
 */
export const sync = async ({ cwd, gitPath }) => {
  try {
    await Git.exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'sync/pullAndRebase',
    })
    console.log('finished pull rebase')
    await Git.exec({
      args: ['push'],
      cwd,
      gitPath,
      name: 'sync/push',
    })
  } catch (error) {
    console.log('error git sync')
    throw new GitError(error, 'sync')
  }
}

/**
 *
 * @param {{cwd:string, gitPath: string,  tag: string}} options
 */
export const tag = async ({ cwd, gitPath, tag }) => {
  try {
    const gitResult = await Git.exec({
      args: ['tag', tag],
      cwd,
      gitPath,
      name: 'tag',
    })
  } catch (error) {
    throw new GitError(error, 'tag')
  }
}

/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const version = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['--version'],
      cwd,
      gitPath,
      name: 'version',
    })
    const stdout = gitResult.stdout
    if (!stdout.startsWith('git version ')) {
      throw new VError('failed to parse git version')
    }
    return stdout.slice('git version '.length)
  } catch (error) {
    throw new GitError(error, 'version')
  }
}
/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const init = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['init'],
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'init')
  }
}

/**
 *
 * @param {{cwd: string, gitPath: string}} options
 */
export const getRemote = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['config', '--get', 'remote.origin.url'],
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'remote')
  }
}

const RE_REF_1 = /^refs\/heads\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/
const RE_REF_2 =
  /^refs\/remotes\/([^/]+)\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/
const RE_REF_3 = /^refs\/tags\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/

'refs/remotes/origin/HEAD 903f9903f4f14e0d7ec1a389b9da617848e7f609'.match(
  RE_REF_2
) //?
/**
 * @param {string} line
 */
const parseRef = (line) => {
  let match
  if ((match = line.match(RE_REF_1))) {
    return { name: match[1], commit: match[2], type: 'head' }
  }
  if ((match = line.match(RE_REF_2))) {
    return {
      name: `${match[1]}/${match[2]}`,
      commit: match[3],
      type: 'remoteHead',
      remote: match[1],
    }
  }
  if ((match = line.match(RE_REF_3))) {
    return {
      name: match[1],
      commit: match[3] ?? match[2],
      type: 'tag',
    }
  }
  console.log({ line })
  return null
}

const parseRefs = (stdout) => {
  const lines = stdout.split('\n')
  const refs = lines.map(parseRef).filter(Boolean)
  return refs
}

/**
 *
 * @param {{cwd: string, gitPath: string}} options
 */
export const getRefs = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: [
        'for-each-ref',
        '--format',
        '%(refname) %(objectname) %(*objectname)',
      ],
      cwd,
      gitPath,
      name: 'init',
    })
    return parseRefs(gitResult.stdout)
  } catch (error) {
    throw new GitError(error, 'getRefs')
  }
}
