import * as Git from '../Git/Git.js'
import * as GitRepositories from '../GitRepositories/GitRepositories.js'

export const wrapGitCommand =
  (fn) =>
  ({ cwd, gitPath, ...args }) => {
    return fn({
      cwd,
      gitPath,
      ...args,
      exec: Git.exec,
      getRepository: GitRepositories.getCurrent,
    })
  }
