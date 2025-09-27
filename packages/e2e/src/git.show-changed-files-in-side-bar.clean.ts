// @ts-ignore

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.show-changed-files-in-side-bar.clean'

export const mockRpc = await createGitMockRpc('show-changed-files')

export const test: Test = async ({ FileSystem, Workspace, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await SideBar.open('Source Control')

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(3)
  await expect(treeItems.nth(0).locator('.Label')).toHaveText('Changes')
  await expect(treeItems.nth(1).locator('.Label')).toHaveText('file-1.txttest')
  await expect(treeItems.nth(2).locator('.Label')).toHaveText('file-2.txttest')
}
