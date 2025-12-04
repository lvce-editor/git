import * as GetBranchQuickPickIcon from '../GetBranchQuickPickIcon/GetBranchQuickPickIcon.ts'
import * as GetShortCommit from '../GetShortCommit/GetShortCommit.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

const toPick = (ref) => {
  return {
    description: GetShortCommit.getShortCommit(ref.commit),
    icon: GetBranchQuickPickIcon.getBranchQuickPickIcon(ref.type),
    label: ref.name,
  }
}

const getRawPicks = async () => {
  const repository = await Repositories.getCurrent()
  const refs = await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
    },
    fn: GitRequests.getRefs,
    id: 'getRefs',
  })
  return refs
}

export const getCheckoutPicks = async () => {
  const rawPicks = await getRawPicks()
  const picks = rawPicks.map(toPick)
  return picks
}
