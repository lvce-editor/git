import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.replace-config-value'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'First User')

  await Command.execute('ExtensionHost.executeCommand', 'git.setConfig', 'user.name', 'Second User')

  const config = await FileSystem.readFile(`${tmpDir}/.git/config`)
  if (config.includes('First User') || !config.includes('name = Second User')) {
    throw new Error(`expected config value to be replaced, got ${config}`)
  }
}
