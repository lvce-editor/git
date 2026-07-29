import * as CheckoutPickType from '../CheckoutPickType/CheckoutPickType.ts'
import * as GetCheckoutPicks from '../GetCheckoutPicks/GetCheckoutPicks.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const getBranchName = async (): Promise<string | undefined> => {
  const name = await Rpc.invoke('QuickPick.showInput', 'Branch name')
  if (typeof name !== 'string' || name === '') {
    return undefined
  }
  return name
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
  return name
}

export const commandCheckout = async (): Promise<string | undefined> => {
  const picks = await GetCheckoutPicks.getCheckoutPicks()
  const selectedPick = await Rpc.invoke('QuickPick.show', picks)
  if (!selectedPick) {
    return
  }
  if (selectedPick.type === CheckoutPickType.CreateBranch) {
    const name = await getBranchName()
    return name ? createAndCheckout(name) : undefined
  }
  if (selectedPick.type === CheckoutPickType.CreateBranchFrom) {
    const name = await getBranchName()
    if (!name) {
      return undefined
    }
    const refPicks = picks.filter((pick: Readonly<GetCheckoutPicks.QuickPickItem>) => pick.type === CheckoutPickType.Ref)
    const selectedRef = await Rpc.invoke('QuickPick.show', refPicks)
    return selectedRef ? createAndCheckout(name, selectedRef.label) : undefined
  }
  const { label } = selectedPick
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
      ref: label,
    },
    fn: GitRequests.checkout,
    id: 'checkout',
  })
  return label
}
