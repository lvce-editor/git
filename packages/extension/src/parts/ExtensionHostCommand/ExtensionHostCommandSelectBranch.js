import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitSelectBranch

export const execute = async () => {
  const branchNames = ['a', 'b', 'c']

  // @ts-ignore
  await vscode.confirm('Select Branch')
  // TODO
  // 1. get all branch names
  // 2. show the quickpick with those branch names
}
