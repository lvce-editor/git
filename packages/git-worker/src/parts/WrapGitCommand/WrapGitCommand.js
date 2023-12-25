import * as Git from '../Git/Git.js'

export const wrapGitCommand =
  (fn) =>
  ({ cwd, gitPath, ...args }) => {
    return fn({
      cwd,
      gitPath,
      ...args,
      exec: Git.exec,
    })
  }
