import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-picker-create-branch-empty-name'

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
  await QuickPick.selectItem('Create new branch...', { waitUntil: 'none' })
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const input = Locator('input[name="QuickPickInput"][placeholder="Branch name"]')
  await expect(input).toBeFocused()
  await Command.execute('QuickPick.selectCurrentIndex')
  await branchPickerPromise

  // assert
  const branchRefs = await FileSystem.readDir(`${workspaceDir}/.git/refs/heads`)
  if (branchRefs.some((entry) => entry.name !== 'feature' && entry.name !== 'main')) {
    throw new Error('expected empty branch name not to create a branch')
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('main')
}
