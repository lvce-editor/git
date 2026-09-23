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

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, Main, QuickPick, Settings, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  await Settings.update({ 'git.branchProtection': false })
  await FileSystem.writeFile(`${workspaceDir}/main-only.txt`, 'main only')
  await Git.add('main-only.txt')
  await Git.commit('Add main-only file')
  await Git.checkout('feature')
  await FileSystem.writeFile(`${workspaceDir}/feature-only.txt`, 'feature only')
  await Git.add('feature-only.txt')
  await Git.commit('Add feature-only file')
  await Git.checkout('main')

  await Main.openUri(`${workspaceDir}/file.txt`)
  await SideBar.open('Explorer')
  const editor = Locator('.Editor')
  await expect(editor).toContainText('main branch')
  const explorerFeatureFile = Locator('.Explorer .TreeItem[aria-label="feature-only.txt"]')
  const explorerMainFile = Locator('.Explorer .TreeItem[aria-label="main-only.txt"]')
  await expect(explorerMainFile).toBeVisible()
  await expect(explorerFeatureFile).toBeHidden()
  await SideBar.open('Source Control')

  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('main')

  const selectBranch = async (branchName: string): Promise<void> => {
    await QuickPick.open()
    await QuickPick.setValue('>Git Checkout')
    await QuickPick.selectItem('Git Checkout', { waitUntil: 'none' })
    const branchItem = Locator('#QuickPick').locator(`text=${branchName}`)
    await expect(branchItem).toBeVisible()
    await QuickPick.selectItem(branchName)
  }

  // act
  await selectBranch('feature')

  // assert
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await waitForFileContent(FileSystem, `${workspaceDir}/file.txt`, 'feature branch')
  await expect(editor).toContainText('feature branch')
  await expect(explorerFeatureFile).toBeVisible()
  await expect(explorerMainFile).toBeHidden()
  await expect(branchStatusBarItem).toHaveText('feature')

  await selectBranch('main')
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  await waitForFileContent(FileSystem, `${workspaceDir}/file.txt`, 'main branch')
  await expect(editor).toContainText('main branch')
  await expect(explorerMainFile).toBeVisible()
  await expect(explorerFeatureFile).toBeHidden()
  await expect(branchStatusBarItem).toHaveText('main')

  await selectBranch('feature')
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await waitForFileContent(FileSystem, `${workspaceDir}/file.txt`, 'feature branch')
  await expect(editor).toContainText('feature branch')
  await expect(explorerFeatureFile).toBeVisible()
  await expect(explorerMainFile).toBeHidden()
  await expect(branchStatusBarItem).toHaveText('feature')
}
