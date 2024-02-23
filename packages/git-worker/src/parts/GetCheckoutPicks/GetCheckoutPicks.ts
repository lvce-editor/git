import * as GetBranchQuickPickIcon from '../GetBranchQuickPickIcon/GetBranchQuickPickIcon.ts'
import * as GetShortCommit from '../GetShortCommit/GetShortCommit.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

const toPick = (ref) => {
  return {
    label: ref.name,
    description: GetShortCommit.getShortCommit(ref.commit),
    icon: GetBranchQuickPickIcon.getBranchQuickPickIcon(ref.type),
  }
}

const getRawPicks = async () => {
  const repository = await Repositories.getCurrent()
  const refs = await GitRepositoriesRequests.execute({
    id: 'getRefs',
    fn: GitRequests.getRefs,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      exec: Git.exec,
    },
  })
  return refs
}

export const getCheckoutPicks = async () => {
  const rawPicks = await getRawPicks()
  const picks = rawPicks.map(toPick)
  return picks
}
