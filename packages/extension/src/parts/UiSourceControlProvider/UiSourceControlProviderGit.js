import * as GitRequests from '../GitRequests/GitRequests.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as CommandAcceptInput from '../ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.js'
import * as CommandFetch from '../ExtensionHostCommand/ExtensionHostCommandGitFetch.js'

export const id = 'git'

export const label = 'Git'

export const acceptInput = CommandAcceptInput

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

export const getChangedFiles = async (cwd) => {
  const repository = await Repositories.getCurrent()
  const modifiedFiles = await GitRequests.getModifiedFiles({
    cwd: repository.path,
    gitPath: repository.gitPath,
  })
  const { index } = modifiedFiles
  return index
}

export const fetch = CommandFetch

export const statusBarCommands = []
