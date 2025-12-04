import { commandInit } from '../CommandInit/CommandInit.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const gitInit = async () => {
  // TODO
  console.log('init')
  await commandInit()
}

const touch = async (fileName: string) => {
  const folder = await Rpc.invoke('Config.getWorkspaceFolder')
  const path = `${folder}/${fileName}`
  await Rpc.invoke(`FileSystem.writeFile`, path, '')
}

const executeAction = async (action) => {
  switch (action.type) {
    case 'git-init':
      return gitInit()
    case 'touch':
      return touch(action.fileName)
  }
}

const executeActions = async (actions) => {
  for (const action of actions) {
    await executeAction(action)
  }
}

export const commandLoadFixture = async (fixtureUrl: string): Promise<void> => {
  console.log('load fixture', fixtureUrl)
  const importUrl = `${fixtureUrl}/git.js`
  const module = await import(importUrl)
  const { actions } = module
  await executeActions(actions)
  console.log({ module })
}
