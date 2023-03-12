import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

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
