import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-context-menu-generic'

export const test: Test = async ({ Command, expect, Git, Locator, SideBar, Workspace }) => {
  const tmpDir = `file:///tmp/lvce-git-status-bar-generic-menu-${crypto.randomUUID()}`
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')
  await Git.checkout('feature')

  await Command.execute('StatusBar.handleContextMenu', 0, 0, 0, '')

  const switchToMain = Locator('.MenuItem', { hasText: 'Switch to main branch' })
  const hideStatusBar = Locator('.MenuItem', { hasText: 'Hide Status Bar' })
  await expect(switchToMain).toBeHidden()
  await expect(hideStatusBar).toBeVisible()
}
