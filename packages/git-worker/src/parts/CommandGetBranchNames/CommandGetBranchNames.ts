import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

export const commandGetBranchnames = async () => {
  const repository = await Repositories.getCurrent()
  const result = await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
    },
    fn: GitRequests.getBranchNames,
    id: 'getBranchNames',
  })
  const trimmed = result.map((item) => item.trim())
  const mapped = trimmed.map((item) => {
    return {
      id: item,
      label: item,
    }
  })
  return mapped
}
