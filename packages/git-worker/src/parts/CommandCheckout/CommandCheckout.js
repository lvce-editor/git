import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'
import * as Rpc from '../Rpc/Rpc.js'

const getShortCommit = (commit) => {
  return commit.slice(0, 8)
}

const toPick = (ref) => {
  return {
    label: ref.name,
    description: getShortCommit(ref.commit),
  }
}

const getPicks = async () => {
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

export const commandCheckout = async () => {
  const rawPicks = await getPicks()
  const picks = rawPicks.map(toPick)
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
