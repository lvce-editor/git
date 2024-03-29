import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Git from '../Git/Git.ts'

/**
 * @param {string} file
 */
export const commandUnstage = async (file) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'unstage',
    fn: GitRequests.unstage,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      file,
      exec: Git.exec,
    },
  })
}
