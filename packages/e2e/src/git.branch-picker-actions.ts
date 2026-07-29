import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-picker-actions'

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // assert
  const input = Locator('#QuickPick input[name="QuickPickInput"]')
  const quickPickItems = Locator('#QuickPick .QuickPickItem')
  const createBranchItem = quickPickItems.nth(0)
  const createBranchFromItem = quickPickItems.nth(1)
  const firstBranchItem = quickPickItems.nth(2)
  await expect(input).toHaveAttribute('placeholder', 'Select a branch or tag to checkout')
  await expect(createBranchItem).toContainText('Create new branch...')
  await expect(createBranchFromItem).toContainText('Create new branch from...')
  await expect(firstBranchItem).toContainText('main')
  await QuickPick.selectItem('main')
  await branchPickerPromise
}
