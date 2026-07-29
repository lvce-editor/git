import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-picker-create-branch-from'

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const branchName = 'new/from-existing'
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await QuickPick.selectItem('Create new branch from...', { waitUntil: 'none' })
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const input = Locator('input[name="QuickPickInput"][placeholder="Branch name"]')
  await expect(input).toBeVisible()
  await input.type(branchName)
  await Command.execute('QuickPick.selectCurrentIndex')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await QuickPick.selectItem('feature')
  await branchPickerPromise

  // assert
  const featureRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/${branchName}`, featureRef)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, `ref: refs/heads/${branchName}\n`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'feature branch')
  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText(branchName)
}
