const gitInit = () => {
  // TODO
  console.log('init')
}

const touch = (fileName: string) => {
  // TODO
  console.log('touch', fileName)
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
  const actions = module.actions
  await executeActions(actions)
  console.log({ module })
}
