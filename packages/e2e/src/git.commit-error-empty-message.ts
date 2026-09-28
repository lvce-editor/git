import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-error-empty-message'

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, Settings, Workspace }) => {
  await Settings.update({ 'git.branchProtection': false })
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Git.addAll()
  await Git.commit('Initial commit')
  const head = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/main`)

  let error: unknown
  try {
    await Command.execute('ExtensionHost.executeCommand', 'git.acceptInput', ' '.repeat(3))
  } catch (error_) {
    error = error_
  }
  if (!String(error).includes('Aborting commit due to empty commit message.')) {
    throw new Error(`Expected empty-message validation, received ${String(error)}`)
  }
  const options = Locator('.NotificationOption')
  await expect(options).toHaveCount(0)
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/heads/main`, head)
}
