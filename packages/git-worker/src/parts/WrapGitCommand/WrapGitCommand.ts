import * as Confirm from '../Confirm/Confirm.ts'
import * as Git from '../Git/Git.ts'
import * as GitRepositories from '../GitRepositories/GitRepositories.ts'

export const wrapGitCommand =
  (fn) =>
  async ({ cwd, ...args }) => {
    const { gitPath, path } = await GitRepositories.getCurrent()
    return fn({
      cwd: path,
      gitPath,
      repositoryPath: path,
      ...args,
      confirm: Confirm.confirm,
      exec: Git.exec,
      getRepository: GitRepositories.getCurrent,
    })
  }
