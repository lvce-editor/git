import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.show-branch-picker'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  // act
  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"]')
  await branchStatusBarItem.click()

  // assert
  const mainBranchItem = Locator('text=main')
  const featureBranchItem = Locator('text=feature')
  await expect(mainBranchItem).toBeVisible()
  await expect(featureBranchItem).toBeVisible()
}
