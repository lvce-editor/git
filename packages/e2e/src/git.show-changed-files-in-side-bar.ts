import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.show-changed-files-in-side-bar'

export const skip = 1

export const test: Test = async ({ Command, Extension, SourceControl, FileSystem, Workspace, Settings, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  // await Extension.addWebExtension(import.meta.resolve('../../extension'))
  const fixtureUrl = import.meta.resolve('../fixtures/git.show-changed-files-in-side-bar')
  await Command.execute('ExtensionHost.executeCommand', `git.loadFixture`, fixtureUrl)

  // act
  await Command.execute('SideBar.show', 'Source Control')

  // assert
  // const treeItems = Locator('.TreeItem')
  // await expect(treeItems).toHaveCount(3)
  // await expect(treeItems.nth(0).locator('.Label')).toHaveText('Changes')
  // await expect(treeItems.nth(1).locator('.Label')).toHaveText('file-1.txttest')
  // await expect(treeItems.nth(2).locator('.Label')).toHaveText('file-2.txttest')
}
