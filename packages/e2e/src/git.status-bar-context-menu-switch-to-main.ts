import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-context-menu-switch-to-main'

export const test: Test = async ({ Command, ContextMenu, expect, Git, Locator, SideBar, StatusBar, Workspace }) => {
  const tmpDir = `file:///tmp/lvce-git-status-bar-context-menu-${crypto.randomUUID()}`
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')
  await Git.checkout('feature')

  const branchStatusBarItem = Locator('.StatusBarItem[name="git.showBranchPicker"], .StatusBarItem[data-name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('feature')

  await Command.execute('StatusBar.handleContextMenu', 0, 0, 0, 'git.showBranchPicker')

  const switchToMain = Locator('.MenuItem', { hasText: 'Switch to main branch' })
  const hideStatusBar = Locator('.MenuItem', { hasText: 'Hide Status Bar' })
  await expect(switchToMain).toBeVisible()
  await expect(hideStatusBar).toBeVisible()
  await ContextMenu.selectItem('Switch to main branch')

  await expect(branchStatusBarItem).toHaveText('main')
}
