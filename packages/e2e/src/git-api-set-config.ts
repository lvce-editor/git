import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.set-config'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const key = 'user.name'
  const value = 'E2E Test User'

  await Workspace.setPath(tmpDir)
  await Git.init()

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.setConfig', key, value)

  // assert
  const configContent = await FileSystem.readFile(`${tmpDir}/.git/config`)
  if (!configContent.includes('name = E2E Test User')) {
    throw new Error(`expected git config to contain user name, got ${configContent}`)
  }
}
