import * as CheckoutPickType from '../CheckoutPickType/CheckoutPickType.ts'
import * as GetCheckoutPicks from '../GetCheckoutPicks/GetCheckoutPicks.ts'
import * as GetNewBranchName from '../GetNewBranchName/GetNewBranchName.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const refreshWorkspace = async (): Promise<void> => {
  await Rpc.invoke('Layout.handleWorkspaceRefresh', { reloadAll: true })
}

const createAndCheckout = async (name: string, startPoint?: string): Promise<string> => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
      name,
      ...(startPoint && { startPoint }),
    },
    fn: GitRequests.branch,
    id: 'branch',
  })
  await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
      ref: name,
    },
    fn: GitRequests.checkout,
    id: 'checkout',
  })
  await refreshWorkspace()
  return name
}

const getLocalBranchName = (label: string, remote: string): string => {
  const prefix = `${remote}/`
  return label.startsWith(prefix) ? label.slice(prefix.length) : label
}

const hasLocalBranch = (picks: readonly GetCheckoutPicks.QuickPickItem[], branchName: string): boolean => {
  return picks.some((pick) => pick.type === CheckoutPickType.Ref && !pick.remote && pick.label === branchName)
}

export const commandCheckout = async (): Promise<string | undefined> => {
  const picks = await GetCheckoutPicks.getCheckoutPicks()
  const selectedPick = await Rpc.invoke('QuickPick.show', picks)
  if (!selectedPick) {
    return
  }
  if (selectedPick.type === CheckoutPickType.CreateBranch) {
    const name = await GetNewBranchName.getNewBranchName()
    return name ? createAndCheckout(name) : undefined
  }
  if (selectedPick.type === CheckoutPickType.CreateBranchFrom) {
    const name = await GetNewBranchName.getNewBranchName()
    if (!name) {
      return undefined
    }
    const refPicks = picks.filter((pick: Readonly<GetCheckoutPicks.QuickPickItem>) => pick.type === CheckoutPickType.Ref)
    const selectedRef = await Rpc.invoke('QuickPick.show', refPicks)
    return selectedRef ? createAndCheckout(name, selectedRef.label) : undefined
  }
  const { label, remote } = selectedPick
  const repository = await Repositories.getCurrent()
  const branchName = remote ? getLocalBranchName(label, remote) : label
  const localBranch = remote && hasLocalBranch(picks, branchName)
  await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
      ref: localBranch ? branchName : label,
      ...(remote && !localBranch && { track: true }),
    },
    fn: GitRequests.checkout,
    id: 'checkout',
  })
  await refreshWorkspace()
  return branchName
}
