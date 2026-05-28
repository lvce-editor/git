import * as Confirm from '../Confirm/Confirm.ts'
import * as Git from '../Git/Git.ts'
import * as GitRepositories from '../GitRepositories/GitRepositories.ts'

export const wrapGitCommand =
  (fn: (args: Readonly<Record<string, any>>) => Promise<any>) =>
  async ({ cwd: _cwd, ...args }: Readonly<{ cwd?: string } & Record<string, any>>): Promise<any> => {
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
