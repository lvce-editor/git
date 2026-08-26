import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-select-branch'

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

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')
  await Git.checkout('main')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const quickPick = Locator('#QuickPick')
  const featureBranchItem = quickPick.locator('text=feature')
  const mainBranchItem = quickPick.locator('text=main')
  const createBranchItem = quickPick.locator('.QuickPickItem').nth(0)
  const createBranchFromItem = quickPick.locator('.QuickPickItem').nth(1)
  const firstBranchItem = quickPick.locator('.QuickPickItem').nth(2)
  await expect(quickPick).toBeVisible()
  await expect(featureBranchItem).toBeVisible()
  await expect(mainBranchItem).toBeVisible()
  await expect(createBranchItem).toContainText('Create new branch...')
  await expect(createBranchFromItem).toContainText('Create new branch from...')
  await expect(firstBranchItem).toContainText('main')
  await QuickPick.selectItem('feature')
  await branchPickerPromise
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // assert
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await expect(branchStatusBarItem).toBeVisible()
  await expect(branchStatusBarItem).toHaveText('feature')
}
