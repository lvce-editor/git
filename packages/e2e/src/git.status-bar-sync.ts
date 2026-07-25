import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-sync'

export const test: Test = async ({ Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-status-bar-sync')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  const branchStatusBarItem = '.StatusBarItem[name="git.showBranchPicker"]'
  const syncStatusBarItem = Locator(`${branchStatusBarItem} + .StatusBarItem[name="git.sync"]`)
  await expect(syncStatusBarItem).toBeVisible()
  await expect(syncStatusBarItem).toHaveText('1↓ 1↑')
  await expect(syncStatusBarItem.locator('.MaskIconSync')).toBeVisible()

  // act
  await Command.execute('StatusBar.handleClick', 'git.sync')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/remote-file.txt`, 'remote change')
  await FileSystem.shouldHaveFile(`${workspaceDir}/local-file.txt`, 'local change')
  await expect(syncStatusBarItem).toHaveText('0↓ 0↑')
}
