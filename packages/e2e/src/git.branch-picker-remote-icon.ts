import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-picker-remote-icon'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-status-bar-sync')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // assert
  const remoteMainItem = Locator('#QuickPick .QuickPickItem').nth(4)
  await expect(remoteMainItem).toContainText('origin/main')
  await expect(remoteMainItem.locator('.MaskIconCloud')).toBeVisible()
  await QuickPick.selectItem('main')
  await branchPickerPromise
}
