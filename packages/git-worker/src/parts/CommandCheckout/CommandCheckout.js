import * as GetCheckoutPicks from '../GetCheckoutPicks/GetCheckoutPicks.js'
import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'
import * as Rpc from '../Rpc/Rpc.js'

export const commandCheckout = async () => {
  const picks = await GetCheckoutPicks.getCheckoutPicks()
  console.log({ picks })
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
