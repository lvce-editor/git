import * as Confirm from '../Confirm/Confirm.ts'
import * as Git from '../Git/Git.ts'
import * as GitRepositories from '../GitRepositories/GitRepositories.ts'

export const wrapGitCommand =
  <Args extends Readonly<Record<string, any>>, Result>(fn: (args: Args) => Promise<Result>) =>
  async ({ cwd: _cwd, ...args }: Readonly<{ cwd?: string } & Record<string, any>>): Promise<any> => {
    const { gitPath, path } = await GitRepositories.getCurrent()
    const targetPath = typeof _cwd === 'string' && _cwd ? _cwd : path
    return fn({
      cwd: targetPath,
      gitPath,
      repositoryPath: targetPath,
      ...args,
      confirm: Confirm.confirm,
      exec: Git.exec,
      getRepository: GitRepositories.getCurrent,
    } as unknown as Args)
  }
