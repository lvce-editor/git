import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.inline-blame'

export const test: Test = async ({ expect, FileSystem, Git, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'
  const fileUri = `${tmpDir}/${fileName}`
  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(fileUri, 'first\nsecond')
  await Git.add(fileName)
  await Git.commit('Initial commit')
  await Settings.update({ 'git.inlineBlame': true })
  await Main.openUri(fileUri)

  const secondRow = Locator('.EditorRow').nth(1)
  // eslint-disable-next-line e2e/no-direct-click
  await secondRow.click()

  const inlineBlame = secondRow.locator('.EditorLineDecoration')
  await expect(inlineBlame).toBeVisible()
  await expect(inlineBlame).toContainText('Test User')
  await expect(inlineBlame).toContainText('Initial commit')
}
