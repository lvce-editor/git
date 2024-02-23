import * as GetBranchQuickPickIcon from '../GetBranchQuickPickIcon/GetBranchQuickPickIcon.js'
import * as GetShortCommit from '../GetShortCommit/GetShortCommit.js'
import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

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
