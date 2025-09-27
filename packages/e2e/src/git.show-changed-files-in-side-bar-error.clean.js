import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const mockRpc = await createGitMockRpc('show-changed-files-error')

export const test = async ({ FileSystem, Workspace, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await SideBar.open('Source Control')

  // assert
  const error = Locator('.Error')
  await expect(error).toBeVisible()
  await expect(error).toHaveText('Error: Git: oops')
}
