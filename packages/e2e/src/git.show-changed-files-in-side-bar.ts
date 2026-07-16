import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.show-changed-files-in-side-bar'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git.show-changed-files-in-side-bar')
  await Command.execute('ExtensionHost.executeCommand', `git.loadFixture`, fixtureUrl)

  // act
  await Command.execute('SideBar.show', 'Source Control')

  // assert
  const treeItems = Locator('.TreeItem')
  const changesGroup = treeItems.nth(0).locator('.Label')
  const firstFile = treeItems.nth(1).locator('.Label')
  const secondFile = treeItems.nth(2).locator('.Label')
  await expect(treeItems).toHaveCount(3)
  await expect(changesGroup).toHaveText('Changes')
  await expect(firstFile).toHaveText('file-1.txt')
  await expect(secondFile).toHaveText('file-2.txt')
}
