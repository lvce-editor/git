import * as Git from '../Git/Git.ts'
import * as GitRepositories from '../GitRepositories/GitRepositories.ts'

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
