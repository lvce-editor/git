import * as Exec from '../Exec/Exec.js'
import * as CommandAcceptInput from '../ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.js'
import * as CommandAdd from '../ExtensionHostCommand/ExtensionHostCommandGitAdd.js'
import * as CommandFetch from '../ExtensionHostCommand/ExtensionHostCommandGitFetch.js'
import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'
import * as GetDecorationIcon from '../GetDecorationIcon/GetDecorationIcon.js'
import * as GetDecorationStrikeThrough from '../GetDecorationStrikeThrough/GetDecorationStrikeThrough.js'
import * as GetStatusText from '../GetStatusText/GetStatusText.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const id = 'git'

export const label = 'Git'

export const acceptInput = CommandAcceptInput.execute

export const add = CommandAdd.execute

export const discard = CommandAdd.execute

export const isActive = async (scheme, root) => {
  if (scheme !== '') {
    return false
  }
  try {
    const {} = await Exec.exec('git', ['rev-parse', '--git-dir'], {
      cwd: root,
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

export const getBadgeCount = async (cwd) => {
  try {
    const repository = await Repositories.getCurrent()
    // TODO only requesting count can be much faster
    const modifiedFiles = await GitRequests.getModifiedFiles({
      cwd: repository.path,
      gitPath: repository.gitPath,
    })
    const count = modifiedFiles.count
    return count
  } catch (error) {
    if (
      error &&
      error.message ===
        `Git.getModifiedFiles failed to execute: fatal: not a git repository (or any of the parent directories): .git`
    ) {
      return 0
    }
    if (error && error.message === 'no repository path found') {
      return 0
    }
    throw error
  }
}

const getWithDecoration = (resource) => {
  return {
    ...resource,
    icon: GetDecorationIcon.getDecorationIcon(resource.status),
    iconTitle: GetStatusText.getStatusText(resource.status),
    strikeThrough: GetDecorationStrikeThrough.getDecorationStrikeThrough(
      resource.status
    ),
  }
}

const getWithDecorations = (index) => {
  return index.map(getWithDecoration)
}

export const getChangedFiles = GetChangedFiles.getChangedFiles

export const fetch = CommandFetch

export const statusBarCommands = []
