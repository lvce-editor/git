import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-branch-hidden-on-workspace-close'
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

  const statusBarItemBranch = Locator('.StatusBarItem[data-name="git.selectBranch"]')
  await expect(statusBarItemBranch).toBeVisible()

  // act
  await Workspace.setPath('')

  // assert
  await expect(statusBarItemBranch).toBeHidden()
}
