import type { Test } from '@lvce-editor/test-with-playwright'
import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const name = 'git.scheme-based-routing.clean'

export const mockRpc = await createGitMockRpc('show-changed-files')

export const test: Test = async ({ FileSystem, Workspace, SideBar, Locator, expect }) => {
  // Test file:// scheme (should use native git)
  const fileTmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(fileTmpDir)

  // Test web:// scheme (should use git-web)
  const webTmpDir = await FileSystem.getTmpDir({ scheme: 'web' })
  await Workspace.setPath(webTmpDir)

  // act
  await SideBar.open('Source Control')

  // assert - both should work but use different backends
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(3)
  await expect(treeItems.nth(0).locator('.Label')).toHaveText('Changes')
  await expect(treeItems.nth(1).locator('.Label')).toHaveText('file-1.txttest')
  await expect(treeItems.nth(2).locator('.Label')).toHaveText('file-2.txttest')
}
