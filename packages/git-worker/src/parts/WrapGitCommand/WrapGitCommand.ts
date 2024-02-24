import * as Git from '../Git/Git.ts'
import * as GitRepositories from '../GitRepositories/GitRepositories.ts'

export const wrapGitCommand =
  (fn) =>
  async ({ cwd, ...args }) => {
    const { path, gitPath } = await GitRepositories.getCurrent()
    return fn({
      cwd: path,
      repositoryPath: path,
      gitPath,
      ...args,
      exec: Git.exec,
      getRepository: GitRepositories.getCurrent,
    })
  }
