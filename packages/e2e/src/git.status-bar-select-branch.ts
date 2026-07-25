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
  await FileSystem.mkdir(workspaceDir)
  await Workspace.setPath(workspaceDir)
  await Git.init({ initialBranch: 'main' })
  await Git.config({
    'user.email': 'test@example.com',
    'user.name': 'Test User',
  })
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'main branch')
  await Git.addAll()
  await Git.commit('Initial commit')
  await SideBar.open('Source Control')

  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toBeVisible()
  await expect(branchStatusBarItem).toHaveText('main')

  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'feature branch')
  await Git.addAll()
  await Git.commit('Feature commit')
  await Git.checkout('main')
  await expect(branchStatusBarItem).toHaveText('main')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const quickPick = Locator('#QuickPick')
  const featureBranchItem = quickPick.locator('text=feature')
  const mainBranchItem = quickPick.locator('text=main')
  const firstBranchItem = quickPick.locator('.QuickPickItem').nth(0)
  await expect(quickPick).toBeVisible()
  await expect(featureBranchItem).toBeVisible()
  await expect(mainBranchItem).toBeVisible()
  await expect(firstBranchItem).toContainText('main')
  await QuickPick.selectItem('feature')
  await branchPickerPromise

  // assert
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await expect(branchStatusBarItem).toHaveText('feature')
}
