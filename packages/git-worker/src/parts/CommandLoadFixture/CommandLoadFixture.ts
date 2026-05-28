import { commandInit } from '../CommandInit/CommandInit.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const gitInit = async (): Promise<void> => {
  await commandInit()
}

const touch = async (fileName: string): Promise<void> => {
  const folder = await Rpc.invoke('Config.getWorkspaceFolder')
  const path = `${folder}/${fileName}`
  await Rpc.invoke(`FileSystem.writeFile`, path, '')
}

const executeAction = async (action: Readonly<{ type: string; fileName?: string }>): Promise<void> => {
  switch (action.type) {
    case 'git-init':
      return gitInit()
    case 'touch':
      return touch(action.fileName ?? '')
    default:
      return
  }
}

const executeActions = async (actions: readonly Readonly<{ type: string; fileName?: string }>[]): Promise<void> => {
  for (const action of actions) {
    await executeAction(action)
  }
}

export const commandLoadFixture = async (fixtureUrl: string): Promise<void> => {
  const importUrl = `${fixtureUrl}/git.js`
  const module = await import(importUrl)
  const { actions } = module
  await executeActions(actions)
}
