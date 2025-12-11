import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitSelectBranch

export const execute = async () => {
  const branchNames = ['a', 'b', 'c']

  // @ts-ignore
  const selectedItem = await vscode.showQuickPick({
    getPicks() {
      return branchNames
    },
    toPick(item) {
      return {
        id: item,
        label: item,
      }
    },
  })

  if (!selectedItem) {
    return
  }
  // TODO checkout that branch
}
