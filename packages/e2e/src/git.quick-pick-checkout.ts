import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-checkout'

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, Main, QuickPick, Settings, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)

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
  await expect(editor).toContainText('feature branch')
  await expect(explorerFeatureFile).toBeVisible()
  await expect(explorerMainFile).toBeHidden()
  await expect(branchStatusBarItem).toHaveText('feature')
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'feature branch')

  await selectBranch('main')
  await expect(editor).toContainText('main branch')
  await expect(explorerMainFile).toBeVisible()
  await expect(explorerFeatureFile).toBeHidden()
  await expect(branchStatusBarItem).toHaveText('main')
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')

  await selectBranch('feature')
  await expect(editor).toContainText('feature branch')
  await expect(explorerFeatureFile).toBeVisible()
  await expect(explorerMainFile).toBeHidden()
  await expect(branchStatusBarItem).toHaveText('feature')
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'feature branch')
}
