import * as GetBranchQuickPickIcon from '../GetBranchQuickPickIcon/GetBranchQuickPickIcon.ts'
import * as GetShortCommit from '../GetShortCommit/GetShortCommit.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

type Ref = {
  commit: string
  name: string
  type: string
}

type QuickPickItem = {
  description: string
  icon: string
  label: string
}

const toPick = (ref: Readonly<Ref>): QuickPickItem => {
  return {
    description: GetShortCommit.getShortCommit(ref.commit),
    icon: GetBranchQuickPickIcon.getBranchQuickPickIcon(ref.type),
    label: ref.name,
  }
}

const getRawPicks = async (): Promise<readonly Ref[]> => {
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

export const getCheckoutPicks = async (): Promise<readonly QuickPickItem[]> => {
  const rawPicks = await getRawPicks()
  return rawPicks.map(toPick)
}
