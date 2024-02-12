import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'
import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitCheckoutRef

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
    },
  })
  return refs
}

// TODO move logic to git worker
export const execute = async () => {
  console.log('checkout ref')
  const selectedPick = await vscode.showQuickPick({
    getPicks,
    toPick,
  })
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
    },
  })
  // console.log({ selectedPick })
}
