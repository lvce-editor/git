import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'quick-pick-select-branch'

export const test: Test = async ({ FileSystem, QuickPick, Settings, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await SideBar.open('Source Control')

  // act
  await QuickPick.executeCommand('Git: Checkout')

  // assert
  // @ts-ignore
  await QuickPick.showHaveItems([
    {
      label: 'b',
    },
    {
      label: 'main',
    },
    {
      label: 'origin/b',
    },
  ])
}
