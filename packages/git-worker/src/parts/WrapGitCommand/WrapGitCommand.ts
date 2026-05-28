import * as Confirm from '../Confirm/Confirm.ts'
import * as Git from '../Git/Git.ts'
import * as GitRepositories from '../GitRepositories/GitRepositories.ts'

export const wrapGitCommand =
  (fn) =>
  async ({ cwd, ...args }) => {
    const { gitPath, path } = await GitRepositories.getCurrent()
    const targetPath = typeof cwd === 'string' && cwd ? cwd : path
    return fn({
      cwd: targetPath,
      gitPath,
      repositoryPath: targetPath,
      ...args,
      confirm: Confirm.confirm,
      exec: Git.exec,
      getRepository: GitRepositories.getCurrent,
    })
  }
