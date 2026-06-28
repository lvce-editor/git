import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-branch-updates-on-checkout'

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  const statusBarItemBranch = Locator('.StatusBarItem[data-name="git.selectBranch"]')
  await expect(statusBarItemBranch).toBeVisible()
  await expect(statusBarItemBranch).toHaveText('main')

  // act
  await Git.checkout('feature')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await expect(statusBarItemBranch).toBeVisible()
  await expect(statusBarItemBranch).toHaveText('feature')
}
