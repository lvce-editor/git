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

/**
 *
 * @param {{cwd:string, message:string}} options
 */
export const addAllAndCommitAndPush = async (options) => {
  // await addAll(options)
  // await commit(options)
  // await push(options)
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
