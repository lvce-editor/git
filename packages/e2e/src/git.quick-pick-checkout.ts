import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-checkout'

const waitForFileContent = async (FileSystem: { readFile: (uri: string) => Promise<string> }, uri: string, expected: string): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    const actual = await FileSystem.readFile(uri)
    if (actual === expected) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const actual = await FileSystem.readFile(uri)
  throw new Error(`expected ${uri} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('main')

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git Checkout')
  await QuickPick.selectItem('Git Checkout', { waitUntil: 'none' })
  const branchItem = Locator('#QuickPick').locator('text=feature')
  await expect(branchItem).toBeVisible()
  await QuickPick.selectItem('feature')

  // assert
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await waitForFileContent(FileSystem, `${workspaceDir}/file.txt`, 'feature branch')
  await expect(branchStatusBarItem).toHaveText('feature')
}
