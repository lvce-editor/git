import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.set-config-value-with-spaces'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const value = 'Test User With Spaces'

  await Workspace.setPath(tmpDir)
  await Git.init()

  await Command.execute('ExtensionHost.executeCommand', 'git.setConfig', 'user.name', value)

  const config = await FileSystem.readFile(`${tmpDir}/.git/config`)
  if (!config.includes(`name = ${value}`)) {
    throw new Error(`expected config value with spaces, got ${config}`)
  }
}
