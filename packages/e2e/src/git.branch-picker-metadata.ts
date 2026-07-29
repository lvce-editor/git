import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-picker-metadata'

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')
  const featureRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature`)
  const featureCommit = featureRef.trim().slice(0, 8)

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // assert
  const featureItem = Locator('#QuickPick .QuickPickItem').nth(3)
  await expect(featureItem).toContainText('feature')
  const description = featureItem.locator('.QuickPickItemDescription')
  await expect(description).toContainText('ago')
  await expect(description).toContainText('Test User')
  await expect(description).toContainText(featureCommit)
  await expect(description).toContainText('Feature commit')
  await QuickPick.selectItem('feature')
  await branchPickerPromise
}
