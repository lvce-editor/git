import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-select-branch'

export const test: Test = async ({ Command, Dialog, expect, FileSystem, Git, Locator, QuickPick, Settings, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const mainWorktreeDir = `${tmpDir}/main-worktree`
  const promptMessages: string[] = []

  await Dialog.mockConfirm((message) => {
    promptMessages.push(message)
    return true
  })
  await Workspace.setUri(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-checkout'))
  await Workspace.setUri(workspaceDir)
  await Settings.update({ 'git.showErrorMessage': false })
  await Git.checkout('feature')
  await Git.createWorktree(mainWorktreeDir, 'main')
  await SideBar.open('Source Control')

  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('feature')

  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  const quickPick = Locator('#QuickPick')
  await expect(quickPick).toBeVisible()
  await expect(quickPick).toContainText('main')
  await QuickPick.selectItem('main')
  await branchPickerPromise

  if (promptMessages.length !== 1) {
    throw new Error(`Expected one checkout error prompt, received ${promptMessages.length}`)
  }
  if (!promptMessages[0].includes('already used by worktree') || !promptMessages[0].includes('main-worktree')) {
    throw new Error(`Expected the Git worktree checkout error, received ${JSON.stringify(promptMessages[0])}`)
  }
  await expect(branchStatusBarItem).toHaveText('feature')
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
}
