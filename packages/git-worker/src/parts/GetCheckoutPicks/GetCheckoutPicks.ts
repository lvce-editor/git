import * as CheckoutPickType from '../CheckoutPickType/CheckoutPickType.ts'
import * as GetBranchQuickPickIcon from '../GetBranchQuickPickIcon/GetBranchQuickPickIcon.ts'
import * as GetShortCommit from '../GetShortCommit/GetShortCommit.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as PrioritizeDefaultBranch from '../PrioritizeDefaultBranch/PrioritizeDefaultBranch.ts'
import * as QuickPickIcon from '../QuickPickIcon/QuickPickIcon.ts'

type Ref = {
  readonly authorName: string
  readonly commit: string
  readonly commitDate: string
  readonly name: string
  readonly remote: string
  readonly subject: string
  readonly symbolicRef?: string
  readonly type: number
}

export type QuickPickItem = {
  readonly description: string
  readonly icon: string
  readonly label: string
  readonly type: string
}

const toPick = (ref: Readonly<Ref>): QuickPickItem => {
  const description = [ref.commitDate, ref.authorName, GetShortCommit.getShortCommit(ref.commit), ref.subject].filter(Boolean).join(' • ')
  return {
    description,
    icon: GetBranchQuickPickIcon.getBranchQuickPickIcon(ref.type),
    label: ref.name,
    type: CheckoutPickType.Ref,
  }
}

const actionPicks: readonly QuickPickItem[] = [
  {
    description: '',
    icon: QuickPickIcon.Add,
    label: 'Create new branch...',
    type: CheckoutPickType.CreateBranch,
  },
  {
    description: '',
    icon: QuickPickIcon.Add,
    label: 'Create new branch from...',
    type: CheckoutPickType.CreateBranchFrom,
  },
]

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
  const prioritizedPicks = PrioritizeDefaultBranch.prioritizeDefaultBranch(rawPicks)
  return [...actionPicks, ...prioritizedPicks.map(toPick)]
}
