import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-branch-visible'
export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await SideBar.open('Source Control')

  // assert
  const statusBarItemBranch = Locator('.StatusBarItem[data-name="git.selectBranch"]')
  await expect(statusBarItemBranch).toBeVisible()
  await expect(statusBarItemBranch).toHaveText('main')
}
