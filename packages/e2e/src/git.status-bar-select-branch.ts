import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-select-branch'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  // TODO
  // await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  // await Workspace.setPath(workspaceDir)
  // await SideBar.open('Source Control')

  // // act
  // await Locator('.StatusBarItem[data-name="git.selectBranch"]').click()

  // // assert
  // await expect(Locator('#QuickPick')).toBeVisible()
  // await expect(Locator('text=feature')).toBeVisible()
  // await expect(Locator('text=main')).toBeVisible()
}
