import * as Confirm from '../Confirm/Confirm.ts'
import * as Git from '../Git/Git.ts'
import * as GitRepositories from '../GitRepositories/GitRepositories.ts'
import * as GitStates from '../GitStates/GitStates.ts'

export const wrapGitCommand =
  <Args extends Readonly<Record<string, any>>, Result>(id: string, fn: (args: Args) => Promise<Result>) =>
  async ({ cwd: _cwd, ...args }: Readonly<{ cwd?: string } & Record<string, any>>): Promise<any> => {
    const repository = await GitRepositories.getCurrent()
    const { gitPath, path } = repository
    const targetPath = typeof _cwd === 'string' && _cwd ? _cwd : path
    GitStates.ensureRepository(path, targetPath)
    const getRepository = async () => {
      return {
        ...repository,
        path: targetPath,
      }
    }
    const result = await fn({
      cwd: targetPath,
      gitPath,
      repositoryPath: targetPath,
      ...args,
      confirm: Confirm.confirm,
      exec: Git.exec,
      getRepository,
    } as unknown as Args)
    if (id === 'getGroups' && Array.isArray(result)) {
      GitStates.setRepositoryGroups(path, targetPath, result)
    }
    return result
  }
