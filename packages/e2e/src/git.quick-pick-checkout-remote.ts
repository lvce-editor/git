import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-checkout-remote'

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-quick-pick-checkout-remote')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await SideBar.open('Source Control')

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git Checkout')
  await QuickPick.selectItem('Git Checkout', { waitUntil: 'none' })
  const remoteBranchItem = Locator('#QuickPick').locator('text=origin/remote-only')
  await expect(remoteBranchItem).toBeVisible()
  await QuickPick.selectItem('origin/remote-only')

  // assert
  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('remote-only')
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/remote-only\n')
  await FileSystem.shouldHaveFile(`${workspaceDir}/remote-only.txt`, 'remote-only branch')
}
