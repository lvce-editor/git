import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore

export const skip = true

export const name = 'git.show-changed-files-in-side-bar-error'

export const test: Test = async ({ Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await Command.execute('SideBar.open', 'Source Control')

  //  assert
  const error = Locator('.Error')
  await expect(error).toBeVisible()
  await expect(error).toHaveText('Error: Git: oops')
  // TODO should improve error message and buttons
  // 1. try again button
  // 2. open git log button
}
