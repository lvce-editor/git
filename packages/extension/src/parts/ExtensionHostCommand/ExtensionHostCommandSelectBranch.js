import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitSelectBranch

const getBranchNames = () => {
  return GitWorker.invoke('Git.getBranchNames')
}

export const execute = async () => {
  // @ts-ignore
  const selectedItem = await vscode.showQuickPick({
    async getPicks() {
      const branchNames = await getBranchNames()
      return branchNames
    },
    toPick(item) {
      return item
    },
  })

  if (!selectedItem) {
    return
  }
  // TODO checkout that branch
}
