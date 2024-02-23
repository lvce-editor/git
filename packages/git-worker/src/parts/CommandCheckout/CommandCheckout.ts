import * as GetCheckoutPicks from '../GetCheckoutPicks/GetCheckoutPicks.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const commandCheckout = async () => {
  const picks = await GetCheckoutPicks.getCheckoutPicks()
  const selectedPick = await Rpc.invoke('QuickPick.show', picks)
  if (!selectedPick) {
    return
  }
  const { label } = selectedPick
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'checkout',
    fn: GitRequests.checkout,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      ref: label,
      exec: Git.exec,
    },
  })
  // console.log({ selectedPick })
}
