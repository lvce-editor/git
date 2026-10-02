import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-picker-local-icon'

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await SideBar.open('Source Control')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')

  // assert
  const mainItem = Locator('#QuickPick .QuickPickItem').nth(2)
  const sourceControlIcon = mainItem.locator('.MaskIconSourceControl')
  await expect(mainItem).toContainText('main')
  await expect(sourceControlIcon).toBeVisible()
  await QuickPick.selectItem('main')
  await branchPickerPromise
}
